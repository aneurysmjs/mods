/** @typedef {import('jscodeshift').API} API */

/**
 * @typedef {object} TransformationData
 * @property {makeDefaultImport} makeDefaultImport
 * @property {makeNamedImport} makeNamedImport
 */

/**
 * @function MakersCreator
 * @param {API['jscodeshift']} j
 * @return {TransformationData}
 */
export default function makersCreator(j) {
  return {
    /**
     * Makes an import declaration with a `import default specifier`
     * @function makeDefaultImport
     * @param {object} dataTransform
     * @param {string} dataTransform.identifier
     * @param {string} dataTransform.source
     */
    makeDefaultImport({ identifier, source }) {
      return j.importDeclaration(
        [j.importDefaultSpecifier(j.identifier(identifier))],
        j.literal(source),
      );
    },

    /**
     * Makes an import declaration with a `import specifier`
     * @function makeNamedImport
     * @param {object} dataTransform
     * @param {string|Array<string>} dataTransform.identifier
     * @param {string} dataTransform.source
     */
    makeNamedImport({ identifier, source }) {
      const specifierArray = Array.isArray(identifier) ? identifier : [identifier];
      const importSpecifiers = specifierArray.map((i) => j.importSpecifier(j.identifier(i)));

      return j.importDeclaration(importSpecifiers, j.literal(source));
    },

    /**
     * Makes an import declaration with a `namespace specifier`
     * @function makeNamespaceImport
     * @param {object} dataTransform
     * @param {string} dataTransform.identifier
     * @param {string} dataTransform.source
     */
    makeNamespaceImport({ identifier, source }) {
      return j.importDeclaration(
        [j.importNamespaceSpecifier(j.identifier(identifier))],
        j.literal(source),
      );
    },
  };
}
