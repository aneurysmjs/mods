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
    const params = [j.identifier(identifier)];

    if (literal) {
      params.push(j.literal(literal));
    }

    return j.variableDeclarator.apply(j, params);
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
