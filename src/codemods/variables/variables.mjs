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
const variableMods = (data) => (fileInfo, api) => {
  const j = api.jscodeshift;

  // const makers = makersCreator(j);

  /**
   * when using using `applyTransform` fileInfo comes directly as a string.
   */
  const root = j(fileInfo.source);

  const variable = j.variableDeclaration('const', [
    j.variableDeclarator(j.identifier('foo'), j.literal('bar')),
    j.variableDeclarator(j.identifier('baz'), j.literal(89)),
  ]);

  if (programBody.length) {
    // programBody.replaceWith(() => {
    //   return [...mapDataToMaker(data, makers)];
    // });
  } else {
    programBody = root.find(j.Program).replaceWith(() => j.program([obj]));
  }

  return programBody.toSource({ quote: 'single', trailingComma: true });
};

export default objectsMod;
