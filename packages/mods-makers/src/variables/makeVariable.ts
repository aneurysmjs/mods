import {
  type FileInfo,
  type API,
  type Collection,
  type Program,
  type ASTPath,
  variableDeclaration,
  variableDeclarator,
  identifier,
} from 'jscodeshift';

const getProgram = (collection: Collection<Program>) => {
  const astPath = collection.get() as ASTPath;

  return astPath.value as Program;
};

const isProgramEmpty = (collectionProgram: Collection<Program>): boolean => {
  return getProgram(collectionProgram).body.length === 0;
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
    // root.get().value.body = [makeVar('foo')];
    getProgram(root).body = [makeVar('foo')];
  }

  return root.toSource();
};
