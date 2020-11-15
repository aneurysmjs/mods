/** @typedef {import('jscodeshift').FileInfo} FileInfo */
/** @typedef {import('jscodeshift').API} API */

/**
 * @function addImports
 * @param {FileInfo} fileInfo
 * @param {API} api
 */
export default function addImports(fileInfo, api) {
  const j = api.jscodeshift;

  /**
   * when using using `applyTransform` fileInfo comes directly as a string.
   */
  const root = j(fileInfo.source);

  const variable = j.variableDeclaration('const', [j.variableDeclarator(j.identifier('test'), j.literal(9)), j.variableDeclarator(j.identifier('baz'), j.literal(89))]);

  const string = j.stringLiteral('jero');

  const importDefaultDeclaration = j.importDeclaration(
    [j.importDefaultSpecifier(j.identifier('a'))],
    j.literal('b'),
  );

  const namedImportDeclaration = j.importDeclaration(
    [j.importSpecifier(j.identifier('Reducer')), j.importSpecifier(j.identifier('Store'))],
    j.literal('redux'),
  );

  const importNamesSpaceDeclaration = j.importDeclaration(
    [j.importNamespaceSpecifier(j.identifier('yeah'))],
    j.literal('b'),
  );


  // const buildProperty = (name, value) => {
  //   return j.property('init', j.identifier(name), j.literal(value));
  // };

  // j.objectExpression([buildProperty('name', 'Джеро')]);

  const result = root
    .find(j.Program)
    /**
     * By hand, accesing the `raw` AST node
     */
    // .forEach((path) => {
    //   path.value.body.push(j(importDeclaration).toSource({ quote: 'single' }));
    //   return path;
    // })
    /**
     * By API, letting jscodeshift
     */
    .replaceWith(() => j.program([variable]))

    .toSource({ quote: 'single', trailingComma: true });

  return result;
}
