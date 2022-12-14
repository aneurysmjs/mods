import { applyTransform } from 'jscodeshift/dist/testUtils';

import renameMethodFromImport from './renameMethodFromImport';

const transformOptions = {};

describe('rename method from import', () => {
  it('rename ONLY methods from User', () => {
    const source = `
      import User from 'user-lib';
      import employeeManager from 'employee-manager';

      User.checkAddress(userData)

      function another() {
        User.checkAddress(userData);
      }

      employeeManager.checkAddress(userData)
    `;

    const output = `
      import User from 'user-lib';
      import employeeManager from 'employee-manager';

      User.check(userData)

      function another() {
        User.check(userData);
      }

      employeeManager.checkAddress(userData)
    `;

    const expected = applyTransform(renameMethodFromImport, transformOptions, { source });

    expect(output.trim()).toEqual(expected);
  });
});
