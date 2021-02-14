import jscodeshift from 'jscodeshift';

import print from '../src/print';

jest.spyOn(console, 'log');

afterAll(() => {
  // @ts-ignore
  console.log.mockRestore();
});

describe('print', () => {
  it('should call console.log', () => {
    print(jscodeshift('<div>Yeah</div>'));
    expect(console.log).toHaveBeenCalledTimes(1);
  });
});
