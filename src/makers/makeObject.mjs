/** @typedef {import('jscodeshift').API} API */


/**
 * @typedef {object} ObjectData
 * @property {string} identifier
 * @property {string} value
 */

/**
 *
 * @param {API['jscodeshift']} j jscodeshift
 */
export default function makeObject(j) {
  /**
   * @param {ObjectData}
   */
  function makeObjectProperty({ identifier, value }) {
    return j.property('init', j.identifier(identifier), j.literal(value));
  }

  /**
   * @param {ObjectData} objData
   */
  function makeObjectExpression(objData) {
    return j.objectExpression([makeObjectProperty(objData)]);
  }

  return { makeObjectProperty, makeObjectExpression };
}
