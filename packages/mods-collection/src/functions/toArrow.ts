import type { FileInfo, API, ReturnStatement } from 'jscodeshift';

import { isReturnStatementNode, isBlockStatementNode } from '@mods/utils';

const toArrow = () => (fileInfo: FileInfo, api: API) => {
  const j = api.jscodeshift;

  /**
   * when using using `applyTransform` fileInfo comes directly as a string.
   */
  const root = j(fileInfo.source);

  const fnExpressions = root.find(j.FunctionExpression);

  const fnExpressionsNoThis = fnExpressions.filter((fn) => {
    return j(fn).find(j.ThisExpression).size() === 0;
  });

  const result = fnExpressionsNoThis.replaceWith((fn) => {
    let { body } = fn.value;
    const { params } = fn.value;

    const isLengthOne = body.body.length === 1;

    const hasReturn = body.body[0] && isReturnStatementNode(body.body[0]);

    const isOneLiner = isBlockStatementNode(body) && isLengthOne && hasReturn;

    if (isOneLiner) {
      const { argument } = body.body[0] as ReturnStatement;

      if (argument !== null) {
        // @ts-ignore -> body is typed as BlockStatement but argument is an Expression
        body = argument ;
      }
    }

    return j.arrowFunctionExpression(params, body, isOneLiner);
  });

  return result.toSource({ quote: 'single', trailingComma: true });
};

export default toArrow;
