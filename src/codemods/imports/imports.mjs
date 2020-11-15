/** @typedef {import('jscodeshift').FileInfo} FileInfo */
/** @typedef {import('jscodeshift').API} API */

/**
 * @function importsMo
 * @param {object} data
 * @return {(fileInfo: FileInfo, api: API) => string}
 */
const importsMod = (data) => (fileInfo, api) => {
  const j = api.jscodeshift;

  /**
   * when using using `applyTransform` fileInfo comes directly as a string.
   */
  const root = j(fileInfo.source);

  /**
   * Makes an import declaration with a `import default specifier`
   * @param {string} identifier
   * @param {string} source
   */
  const makeDefaultImport = (identifier, source) =>
    j.importDeclaration([j.importDefaultSpecifier(j.identifier(identifier))], j.literal(source));

  /**
   * Makes an import declaration with a `import specifier`
   * @param {string|Array<string>} identifier
   * @param {string} source
   */
  const makeNamedImport = (identifier, source) => {
    const specifierArray = Array.isArray(identifier) ? identifier : [identifier];
    const importSpecifiers = specifierArray.map((i) => j.importSpecifier(j.identifier(i)));

    return j.importDeclaration(importSpecifiers, j.literal(source));
  };

  let importsBody = root.find(j.ImportDeclaration);

  if (importsBody.length) {
    importsBody.replaceWith(() => {
      return [
        makeNamedImport(...Object.values(data.namedImport)),
        makeDefaultImport(...Object.values(data.importDefault)),
      ];
    });
  } else {
    // importsBody = root.find(j.Program).replaceWith(() => j.program([importDefaultDeclaration]));
  }

  return importsBody.toSource({ quote: 'single', trailingComma: true });
};

export default importsMod;
