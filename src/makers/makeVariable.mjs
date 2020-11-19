/** @typedef {import('jscodeshift').API} API */

/**
 * @typedef {object} Declarator
 * @property {string} identifier
 * @property {string} literal
 */

/**
 *
 * @param {API['jscodeshift']} j jscodeshift
 */
export default function createVariable(j) {
  /**
   * @function makeVariableDeclarator
   * @param {Declarator} declarator
   */
  function makeVariableDeclarator({ identifier, literal }) {
    return j.variableDeclarator(j.identifier(identifier), literal && j.literal(literal));
  }

  /**
   * @function makeVariableDeclaration
   * @param {object} dataVariable
   * @param {"var" | "let"| "const"} dataVariable.kind
   * @param {Declarator | Array<Declarator>} dataVariable.declarations
   */
  function makeVariableDeclaration({ kind, declarations }) {
    const declarators = Array.isArray(declarations) ? declarations : [declarations];

    return j.variableDeclaration(kind, declarators.map(makeVariableDeclarator));
  }
  return { makeVariableDeclaration };
}
