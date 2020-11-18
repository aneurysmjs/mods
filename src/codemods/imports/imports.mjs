/** @typedef {import('jscodeshift').FileInfo} FileInfo */
/** @typedef {import('jscodeshift').API} API */

import makersCreator from '../ultis/makersCreator';
import mapDataToMaker from '../ultis/mapDataToMaker';

/**
 * @function importsMod
 * @param {object} data
 * @return {(fileInfo: FileInfo, api: API) => string}
 */
const importsMod = (data) => (fileInfo, api) => {
  const j = api.jscodeshift;


  const makers = makersCreator(j);

  /**
   * when using using `applyTransform` fileInfo comes directly as a string.
   */
  const root = j(fileInfo.source);

  let importsBody = root.find(j.ImportDeclaration);

  if (importsBody.length) {
    importsBody.replaceWith(() => {
      return [...mapDataToMaker(data, makers)];
    });
  } else {
    importsBody = root
      .find(j.Program)
      .replaceWith(() => j.program([...mapDataToMaker(data, makers)]));
  }

  return importsBody.toSource({ quote: 'single', trailingComma: true });
};

export default importsMod;
