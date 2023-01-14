import path from 'node:path';
// @ts-ignore
import { runInlineTest } from 'jscodeshift/dist/testUtils';
import { defineTestForFixtures } from './defineTestForFixtures';

const dirName = path.resolve(__dirname);

jest.mock('jscodeshift/dist/testUtils', () => ({
  runInlineTest: jest.fn(),
}));

afterEach(() => {
  jest.resetAllMocks();
});

describe('defineTestForFixtures', () => {
  // it('should throw if folder "__testfixtures__" doesn\'t exist', async () => {
  //   await expect(
  //     defineTestForFixtures({ dirName, transformName: 'testTransform' }),
  //   ).rejects.toEqual(`'${testfixturesDir}' folder not found`);
  // });

  describe('running fixures', () => {
    it('should be called "runInlineTest" with options', async () => {
      await defineTestForFixtures({ dirName, transformName: 'foo' });
      expect(runInlineTest).toHaveBeenCalled();
    });
  });
});
