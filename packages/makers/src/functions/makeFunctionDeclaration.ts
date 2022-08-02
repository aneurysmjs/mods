import { functionDeclaration, identifier, blockStatement, Statement } from 'jscodeshift';

export type Params = Parameters<typeof functionDeclaration>[1];
export type Body = Parameters<typeof blockStatement>[0];

export default function makeFunctionDeclaration(name: string, params: Params, body: Body) {
  return functionDeclaration(identifier(name), params, blockStatement(body));
}
