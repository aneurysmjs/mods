import isPrimitive from './isPrimitive';

describe('isPrimitive', () => {
  it('should be true for boolean', () => {
    expect(isPrimitive(typeof false)).toBe(true);
  });

  it('should be true for string', () => {
    expect(isPrimitive(typeof '')).toBe(true);
  });

  it('should be true for number', () => {
    expect(isPrimitive(typeof 1)).toBe(true);
  });

  it('should be true for symbol', () => {
    expect(isPrimitive(typeof Symbol(`I'm symbol`))).toBe(true);
  });

  it('should be false for object', () => {
    expect(isPrimitive(typeof {})).toBe(true);
  });

  it('should be false for array', () => {
    expect(isPrimitive(typeof [])).toBe(true);
  });

  it('should be false for function', () => {
    expect(isPrimitive(typeof function () {})).toBe(true);
  });
});

// describe('Print', () => {
//   describe('call expression', () => {
//     const source = `

//     `;

//     const output = `
//     foo(bar);
//     `;

//     const expected = applyTransform(callExpressionTransform, transformOptions, { source });

//     it('creates a function declaration with no return statement', () => {
//       expect(output.trim()).toEqual(expected);
//     });
//   });
// });
