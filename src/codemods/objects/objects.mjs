/** @typedef {import('jscodeshift').FileInfo} FileInfo */
/** @typedef {import('jscodeshift').API} API */

/**
 * @typedef {object} ObjectData
 * @property {string} identifier
 * @property {string} value
 */

/**
 * @function objectsMod
 * @param {ObjectData} data
 * @return {(fileInfo: FileInfo, api: API) => string}
 */
const objectsMod = (data) => (fileInfo, api) => {
  const j = api.jscodeshift;

  // const makers = makersCreator(j);

  /**
   * when using using `applyTransform` fileInfo comes directly as a string.
   */
  const root = j(fileInfo.source);

  /**
   * @param {ObjectData}
   */
  const buildProperty = ({ identifier, value }) => {
    return j.property('init', j.identifier(identifier), j.literal(value));
  };
  /**
   * @param {ObjectData} objData
   */
  const createObjectExpression = (objData) => j.objectExpression([buildProperty(objData)]);

  let programBody = root.find(j.ImportDeclaration);

  const obj = j.variableDeclaration('const', [
    j.variableDeclarator(j.identifier('obj'), createObjectExpression(data)),
  ]);

  if (programBody.length) {
  } else {
    programBody = root.find(j.Program).replaceWith(() => j.program([obj]));
  }

  return programBody.toSource({ quote: 'single', trailingComma: true });
};

export default objectsMod;
