/** @typedef {import('jscodeshift').API} API */

/**
 *
 * @param {API['jscodeshift']} j jscodeshift
 */
export default function makeFunction(j) {
  /**
   * @function makeVariableDeclaration
   * @param {object} dataVariable
   * @param {string} dataVariable.identifier
   * @param {Array<any>} [dataVariable.params = []]
   * @param {any} [dataVariable.body = []]
   */
  function makeFunctionDeclaration({ identifier, params = [], body = [] }) {
    return j.functionDeclaration(j.identifier(identifier), params, j.blockStatement(body));
  }

  return { makeFunctionDeclaration };
}
