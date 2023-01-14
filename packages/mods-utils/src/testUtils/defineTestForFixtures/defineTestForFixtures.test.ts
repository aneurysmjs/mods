// @ts-ignore
import fs from 'node:fs';
import path from 'node:path';
// @ts-ignore
import { runInlineTest } from 'jscodeshift/dist/testUtils';
import { defineTestForFixtures } from './defineTestForFixtures';

const testfixturesDir = '__testfixtures__';
const dirName = path.resolve(__dirname);
const fixturesFolder = path.resolve(dirName, testfixturesDir);

const fixtures = ['foo', 'bar', 'baz'];

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
    beforeAll(() => {
      if (!fs.existsSync(fixturesFolder)) {
        fs.mkdirSync(fixturesFolder);
      }

      for (const fixture of fixtures) {
        const fixtureName = `${fixture}.js`;
        fs.writeFileSync(path.join(dirName, fixtureName), '');
        fs.writeFileSync(path.join(dirName, fixtureName), `const ${fixture} = '${fixtureName}'`);
      }

      for (const fixture of fixtures) {
        for (const fixtureType of ['input', 'output']) {
          const fixtureName = `${fixture}.${fixtureType}.js`;
          fs.writeFileSync(path.join(fixturesFolder, fixtureName), '');
          fs.writeFileSync(
            path.join(fixturesFolder, fixtureName),
            `const ${fixture} = '${fixtureName}';\n`,
          );
        }
      }
    });

    afterAll(() => {
      for (const fixture of fixtures) {
        const fixtureName = `${fixture}.js`;
        fs.unlinkSync(path.join(dirName, fixtureName));
      }

      for (const fixture of fixtures) {
        for (const fixtureType of ['input', 'output']) {
          const fixtureName = `${fixture}.${fixtureType}.js`;
          //  fs.unlinkSync(fixtureName);
          fs.unlinkSync(path.join(dirName, testfixturesDir, fixtureName));
        }
      }
      fs.rmSync(fixturesFolder, { recursive: true });
    });

    // it('should be called "runInlineTest" with options', async () => {
    //   await defineTestForFixtures({ dirName, transformName: 'foo' });
    //   expect(runInlineTest).toHaveBeenCalled();
    // });

    // it('should be called "runInlineTest" with options', async () => {
    //   await defineTestForFixtures({ dirName, transformName: 'bar' });
    //   expect(runInlineTest).toHaveBeenCalled();
    // });
    it('should be called "runInlineTest" with options', async () => {
      await defineTestForFixtures({ dirName, transformName: 'bar' });
      expect(runInlineTest).toHaveBeenCalled();
    });
  });
});
