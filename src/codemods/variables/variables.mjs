/** @typedef {import('jscodeshift').FileInfo} FileInfo */
/** @typedef {import('jscodeshift').API} API */

import makeVariable from '../../makers/makeVariable.mjs';

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

  const { makeVariableDeclaration } = makeVariable(j);

  /**
   * when using using `applyTransform` fileInfo comes directly as a string.
   */
  const root = j(fileInfo.source);

  const variable = makeVariableDeclaration(data);

  let programBody = root.find(j.VariableDeclaration);

  if (programBody.length) {
    // programBody.replaceWith(() => {
    //   return [...mapDataToMaker(data, makers)];
    // });
  } else {
    programBody = root.find(j.Program).replaceWith(() => j.program([variable]));
  }

  return programBody.toSource({ quote: 'single', trailingComma: true });
};

export default variableMods;
