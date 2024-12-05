// @ts-ignore
import j, { Collection, ASTPath, Node, Identifier, ASTNode } from 'jscodeshift';
// / import { print } from '@mods/utils';

/**
 * @see https://github.com/benjamn/ast-types/blob/master/src/test/ecmascript.ts
 * @see https://github.com/benjamn/ast-types/blob/master/src/test/typescript.ts
 */
interface Scope {
  path: ASTPath;
  node: ASTNode;
  isGlobal: boolean;
  depth: number;
  parent: Scope;
  bindings: Record<string, unknown>;
  types: Record<string, unknown>;
  didScan: boolean;
  declares(name: string): unknown;
  declaresType(name: string): unknown;
  declareTemporary(prefix?: string): unknown;
  injectTemporary(identifier: any, init: any): unknown;
  // @see https://github.com/benjamn/ast-types/blob/master/src/scope.ts#L164
  scan(force?: boolean): void;
  getBindings(): Record<string, unknown>;
  getTypes(): Record<string, unknown>;
  lookup(name: string): Scope;
  lookupType(name: string): {
    getTypes: Scope['getTypes'];
  };
  getGlobalScope(): Scope;
}

export function getIdentifierScopes(identifierName: string, ast: Collection) {
  const identifierOccurrences = ast.find(j.Identifier, { name: identifierName });

  if (identifierOccurrences.length === 0) {
    throw new Error(`Identifier "${identifierName}" not found in the AST`);
  }

  const identifierScopes = new Set();

  identifierOccurrences.forEach((identifier) => {
    //const identifierScope = identifier.closestScope();
    // const identifierScope = identifier.scope();
    // @ts-ignore
    const test = identifier.scope as Scope;
    // @ts-ignore
    const node = identifier;

    identifierScopes.add('vaya');
  });

  return Array.from(identifierScopes);
}

/**
 * @description The inferred type of 'getVariableScope' cannot be named without a reference to '.pnpm/ast-types@0.14.2/node_modules/ast-types'. This is likely not portable. A type annotation is necessary.
 * @see https://stackoverflow.com/a/78111987/5378393
 */
type ClosestScope = Collection<ASTNode>;

export function getVariableScope(variableName: string, ast: Collection) {
  const variableDeclaration = ast.find(j.VariableDeclaration, {
    declarations: [{ id: { name: variableName } }],
  });

  if (variableDeclaration.length === 0) {
    throw new Error(`Variable "${variableName}" not found in the AST`);
  }

  const variableScope: ClosestScope = variableDeclaration.closestScope();

  return variableScope;
}

// // Usage example
// const source = `
//   function foo() {
//     const bar = 123;
//     console.log(bar);
//   }
// `;

// const ast = j(source);

// const variableScope = getVariableScope('bar', ast);

// print(variableScope);
// const identifierScopes = getIdentifierScopes('bar', ast);

// console.log('variableScope', JSON.stringify(variableScope, null, 2));
// console.log('variableScope', variableScope.get().value.id.name);
// @ts-ignore
// console.log(identifierScopes.map((scope) => scope.value)); // should print an array with the function node and the program node

// console.log(variableScope.path.value); // should print the function node where the variable was declared
//
