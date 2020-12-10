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

  if (data?.meta?.convertToAsync) {
    const result = root.find(j.ReturnStatement, {
      argument: {
        type: 'NewExpression',
        callee: {
          type: 'Identifier',
          name: 'Promise',
        },
      },
    });

    result.replaceWith((nodePath) => {
      const parentFunction = j(nodePath).closest(j.FunctionDeclaration);
      const promiseCallback = nodePath.value.argument.arguments[0];
      const resolveCallback = promiseCallback.params[0];

      const paramResolveCallback = j(promiseCallback).find(j.CallExpression, {
        callee: {
          name: resolveCallback.name,
        },
      });

      // here we set it as `async function`
      parentFunction.get().node.async = true;
      // return a 'return statement' with revolve's arguments;
      return j.returnStatement(...paramResolveCallback.get().node.arguments);
    });

    return result.toSource({ quote: 'single', trailingComma: true });
  }
};

export default replacePropertiesMod;
