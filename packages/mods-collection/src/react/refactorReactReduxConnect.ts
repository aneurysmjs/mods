/**
 * @see https://github.com/sharils/slides/blob/master/20171105-jscodeshift-refactor-js-with-js/demo-5/demo-5-transform.js
 */
import type { ExpressionKind } from 'ast-types/gen/kinds';
import type {
  FileInfo,
  API,
  ExpressionStatement,
  RecursiveMatchNode,
  ASTPath,
  CallExpression,
} from 'jscodeshift';

// const callingConnect = {
//   expression: {
//     type: 'CallExpression',
//     callee: {
//       type: 'CallExpression',
//       callee: {
//         type: 'Identifier',
//         name: 'connect',
//       },
//       arguments: {
//         0: {
//           type: 'ArrowFunctionExpression',
//         },
//         1: {
//           type: 'ArrowFunctionExpression',
//         },
//         length: 2,
//       },
//     },
//     arguments: {
//       length: 1,
//     },
//   },
// };

const callingConnect: RecursiveMatchNode<ExpressionStatement> = {
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'connect',
      },
    },
  },
};

const argsFromNestedCallExpression = (path: ASTPath<ExpressionStatement>) => {
  const CallExpression = path.value.expression as CallExpression;
  const callee = CallExpression.callee as CallExpression;

  return callee.arguments as ExpressionKind[];
};

const setArgsForNestedCallExpression = (
  path: ASTPath<ExpressionStatement>,
  index: number,
  expression: ExpressionKind,
) => {
  const args = argsFromNestedCallExpression(path);

  args[index] = expression;
};

export default function refactorReactReduxConnect(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  return j(fileInfo.source)
    .find(j.ExpressionStatement, callingConnect)

    .insertBefore((path: ASTPath<ExpressionStatement>) => [
      j.variableDeclaration('const', [
        j.variableDeclarator(
          j.identifier('mapStateToProps'),
          argsFromNestedCallExpression(path)[0],
        ),
      ]),
      j.variableDeclaration('const', [
        j.variableDeclarator(
          j.identifier('mapDispatchToProps'),
          argsFromNestedCallExpression(path)[1],
        ),
      ]),
    ])
    .forEach((path) => {
      // basically we abstract
      // path.value.expression.callee.arguments[0] = j.identifier('mapStateToProps');
      // path.value.expression.callee.arguments[1] = j.identifier('mapDispatchToProps');
      setArgsForNestedCallExpression(path, 0, j.identifier('mapStateToProps'));
      setArgsForNestedCallExpression(path, 1, j.identifier('mapDispatchToProps'));
    })
    .toSource();
}
