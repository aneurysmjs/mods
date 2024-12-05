import { functionDeclaration, identifier, blockStatement } from 'jscodeshift';

export type Params = Parameters<typeof functionDeclaration>[1];
export type Body = Parameters<typeof blockStatement>[0];

type FunctionDeclaration = ReturnType<typeof functionDeclaration>

export default function makeFunctionDeclaration(
  name: string,
  params: Params,
  body: Body,
): FunctionDeclaration {
  return functionDeclaration(identifier(name), params, blockStatement(body));
}
