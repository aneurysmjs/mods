import type { FileInfo, API } from 'jscodeshift';

// console.log('import.meta------', import.meta);
// export const parser = 'ts';

export default (fileInfo: FileInfo, api: API) => {
  const j = api.jscodeshift;

  // const one = j.variableDeclarator(j.identifier('one'), null);

  const ast = j(fileInfo.source);
  const fndcl = ast.find(j.FunctionDeclaration, {
    id: {
      name: 'bar',
    },
  });
  // .insertBefore(one);
  // .forEach((path) => {
  //   console.log(path.scope);

  //   const varsToDelete = j(path).find(j.VariableDeclaration);

  //   ast
  //     .find(j.FunctionDeclaration, {
  //       id: {
  //         name: 'foo',
  //       },
  //     })
  //     .insertBefore(() => varsToDelete.nodes());

  //   varsToDelete.remove();
  // });

  console.log('fndcl', fndcl);

  return ast.toSource();
};
