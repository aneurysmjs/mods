function isPrimitive(val: unknown) {
  return val == null || /^[sbn]/.test(typeof val);
}

export default function looksLike<T extends Record<string, any>>(a: T, b: Record<keyof T, any>): boolean {
  return (
    a &&
    b &&
    Object.keys(b).every((bKey) => {
      const aVal = a[bKey];
      const bVal = b[bKey];

      if (typeof bVal === 'function') {
        return bVal(aVal);
      }

      return isPrimitive(bVal) ? bVal === aVal : looksLike(aVal, bVal);
    })
  );
}

const obj = {
  name: 'jero',
  age: 33,
};

const result = looksLike(obj, { age });
