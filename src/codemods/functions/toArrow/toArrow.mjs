/** @typedef {import('jscodeshift').FileInfo} FileInfo */
/** @typedef {import('jscodeshift').API} API */

import isBlockStatement from '../../../utils/isBlockStatement';
import isReturnStatement from '../../../utils/isReturnStatement';

/**
 * @function toArrow
 * @return {(fileInfo: FileInfo, api: API) => string}
 */
const toArrow = () => (fileInfo, api) => {
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

    const hasReturn = isReturnStatement(body.body[0].type);

    const isOneLiner = isBlockStatement(body.type) && isLengthOne && hasReturn;

    if (isOneLiner) {
      body = body.body[0].argument;
    }

    return j.arrowFunctionExpression(params, body, isOneLiner);
  });

  return result.toSource({ quote: 'single', trailingComma: true });
};

export default toArrow;
