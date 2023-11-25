import type { FileInfo, API } from 'jscodeshift';

export const parser = 'ts';

export default (fileInfo: FileInfo, api: API) => {
  const j = api.jscodeshift;

  // Find the root AST (Abstract Syntax Tree) of the file
  const root = j(fileInfo.source);

  // Search for all variable declarators in the code
  root.find(j.VariableDeclarator).forEach((path) => {
    const variableDeclarator = path.value;

    // Replace the value with a new Map
    variableDeclarator.init = j.newExpression(
      j.identifier('Map'), // Create a new Map
      [
        j.arrayExpression([
          j.arrayExpression([j.literal('keyA'), j.literal('valueA')]),
          j.arrayExpression([j.literal('keyB'), j.literal('valueB')]),
        ]),
      ],
    );
  });

  return root.toSource();
};
