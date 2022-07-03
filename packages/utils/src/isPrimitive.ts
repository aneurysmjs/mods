/**
 *
 * @param {unknown} val
 * @returns boolean
 */
export default function isPrimitive(val: unknown) {
  return val == null || /^[sbn]/.test(typeof val);
}
