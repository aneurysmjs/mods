import type { FileInfo, API, JSCodeshift, Collection, Program } from 'jscodeshift';
import { variableDeclaration, variableDeclarator, identifier } from 'jscodeshift';

const isProgramEmpty = (collectionProgram: Collection<Program>): boolean => {
  return collectionProgram.get().value.body.length === 0;
};

const makeVar = (identifierName: string) => {
  const ast = variableDeclaration('var', [variableDeclarator(identifier(identifierName))]);

  return ast;
};

export const parser = 'ts';

export default (fileInfo: FileInfo, api: API) => {
  const j = api.jscodeshift;

  const root = j(fileInfo.source).find(j.Program);

  if (isProgramEmpty(root)) {
    root.get().value.body = [makeVar('foo')];
  }

  return root.toSource();
};
