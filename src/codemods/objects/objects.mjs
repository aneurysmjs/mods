import makeObject from '../../makers/makeObject.mjs';

/** @typedef {import('jscodeshift').FileInfo} FileInfo */
/** @typedef {import('jscodeshift').API} API */

/**
 * @function objectsMod
 * @param {ObjectData} data
 * @return {(fileInfo: FileInfo, api: API) => string}
 */
const objectsMod = (data) => (fileInfo, api) => {
  const j = api.jscodeshift;

  const { makeObjectProperty, makeObjectExpression } = makeObject(j);

  /**
   * when using using `applyTransform` fileInfo comes directly as a string.
   */
  const root = j(fileInfo.source);

  let programBody = root.find(j.ObjectExpression);

  const obj = j.variableDeclaration('const', [
    j.variableDeclarator(j.identifier('obj'), makeObjectExpression(data)),
  ]);

  if (programBody.length) {
    programBody.replaceWith((node) => {
      node.value.properties.push(
        makeObjectProperty({ identifier: 'email', value: 'info@test.com' }),
      );

      return node.value;
    });
  } else {
    programBody = root.find(j.Program).replaceWith(() => j.program([obj]));
  }

  return programBody.toSource({ quote: 'single', trailingComma: true });
};

export default objectsMod;
