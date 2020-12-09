/** @typedef {import('jscodeshift').FileInfo} FileInfo */
/** @typedef {import('jscodeshift').API} API */

/**
 * @function objectsMod
 * @param {ObjectData} data
 * @return {(fileInfo: FileInfo, api: API) => string}
 */
const replacePropertiesMod = (data) => (fileInfo, api) => {
  const j = api.jscodeshift;

  /**
   * when using using `applyTransform` fileInfo comes directly as a string.
   */
  const root = j(fileInfo.source);

  if (data?.meta?.replaceByArrowFunction) {
    const result = root.find(j.Property);
    result
      .filter((nodePath) => {
        return nodePath.value.value.value === data.desc.value;
      })
      .replaceWith((nodePath) => {
        const { node } = nodePath;
        const fn = j.arrowFunctionExpression([], j.literal(node.value.value));
        return j.property('init', j.identifier(node.key.name), fn);
      });

    return result.toSource({ quote: 'single', trailingComma: true });
  }
};

export default replacePropertiesMod;
