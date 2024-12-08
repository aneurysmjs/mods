import isPrimitive from './isPrimitive';

function keys<T extends object>(object: T): (keyof T)[] {
  return Object.keys(object) as (keyof T)[];
}

function isFunction(val: unknown): val is (...args: any[]) => any {
  return typeof val === 'function';
}

export default function looksLike<T extends Record<string, any>>(
  a: T | undefined,
  b: Record<keyof T | string, any> | undefined,
): boolean {
  // Check if either a or b is undefined
  if (!a || !b) {
    return false;
  }

  // If b is empty, return false if a is not empty
  if (Object.keys(b).length === 0) {
    return Object.keys(a).length === 0; // Return true only if a is also empty
  }

  // Check if all keys in b exist in a and match the criteria
  const result = keys(b).every((bKey) => {
    const aVal = a[bKey];
    const bVal = b[bKey];

    if (isFunction(bVal)) {
      return bVal(aVal);
    }

    return isPrimitive(bVal) ? bVal === aVal : looksLike(aVal, bVal);
  });

  return result;
}
