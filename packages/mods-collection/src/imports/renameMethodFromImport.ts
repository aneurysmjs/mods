import type { FileInfo, API, Identifier } from 'jscodeshift';

export const parser = 'ts';

export default (fileInfo: FileInfo, api: API) => {
  const j = api.jscodeshift;

  const root = j(fileInfo.source)
    .find(j.MemberExpression)
    .filter((path) => {
      return (path.node.property as Identifier).name === 'checkAddress';
    })
    .forEach((path) => {
      const objName = (path.node.object as Identifier).name;
      const scope = path.scope.lookup(objName);
      const bindings = scope.getBindings()[objName];

      //@ts-ignore
      bindings.forEach((binding) => {
        const gp = binding.parent.parent.node;

        if (binding.node.name === 'User' && gp.type === 'ImportDeclaration') {
          if (gp.source.value === 'user-lib') {
            (path.node.property as Identifier).name = 'check';
          }
        }
      });
    });

  return root.toSource();
};
