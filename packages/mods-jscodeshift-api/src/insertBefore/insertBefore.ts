import type { FileInfo, API } from 'jscodeshift';

export default (fileInfo: FileInfo, api: API) => {
  const j = api.jscodeshift;

  const ast = j(fileInfo.source);

  const one = j.variableDeclarator(j.identifier('one'), null);

  ast.find(j.VariableDeclarator).insertBefore(one);

  return ast.toSource();
};
