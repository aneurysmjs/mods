/** @typedef {import('jscodeshift').FileInfo} FileInfo */
/** @typedef {import('jscodeshift').API} API */

import makeFunction from '../../makers/makeFunction.mjs';

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
const functionMods = (data) => (fileInfo, api) => {
  const j = api.jscodeshift;

  const { makeFunctionDeclaration } = makeFunction(j);

  /**
   * when using using `applyTransform` fileInfo comes directly as a string.
   */
  const root = j(fileInfo.source);

  let programBody = root.find(j.FunctionDeclaration);

  if (programBody.length) {
  } else {
    programBody = root
      .find(j.Program)
      .replaceWith(() => j.program([makeFunctionDeclaration(data)]));
  }

  return programBody.toSource({ quote: 'single', trailingComma: true });
};

export default functionMods;
