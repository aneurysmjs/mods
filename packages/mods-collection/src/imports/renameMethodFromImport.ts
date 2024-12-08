import type { FileInfo, API, Identifier, ASTPath as JSCodeshiftASTPath } from 'jscodeshift';

interface Scope {
  // path: ASTPath;
  node: any;
  isGlobal: boolean;
  depth: number;
  parent: any;
  bindings: any;
  types: any;
  didScan: boolean;
  declares(name: any): any;
  declaresType(name: any): any;
  declareTemporary(prefix?: any): any;
  injectTemporary(identifier: any, init: any): any;
  scan(force?: any): any;
  getBindings(): Record<string, ASTPath[]>;
  getTypes(): any;
  lookup(name: string): Scope | null;
  lookupType(name: string): {
    getTypes: Scope['getTypes'];
  };
  getGlobalScope(): Scope;
}

interface ASTPath extends JSCodeshiftASTPath {
  parent: ASTPath;
}

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
      const scope = (path.scope as Scope).lookup(objName);

      if (scope) {
        const bindings = scope.getBindings()[objName];

        bindings.forEach((binding) => {
          const grandParent = binding.parent.parent.node;

          if (
            (binding.node as Identifier).name === 'User' &&
            grandParent.type === 'ImportDeclaration'
          ) {
            if (grandParent.source.value === 'user-lib') {
              (path.node.property as Identifier).name = 'check';
            }
          }
        });
      }
    });

  return root.toSource();
};
