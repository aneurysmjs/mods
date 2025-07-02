import { vi, afterEach, describe, it, beforeAll, afterAll, expect, type Mock } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { runInlineTest } from 'jscodeshift/dist/testUtils';
import { defineTestForFixtures } from './defineTestForFixtures.js';

const testfixturesDir = '__testfixtures__';
const dirName = path.resolve(__dirname);
const fixturesFolder = path.resolve(dirName, testfixturesDir);

const transforms = ['foo'];

vi.mock('jscodeshift/dist/testUtils', () => ({
  runInlineTest: vi.fn(),
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe.skip('defineTestForFixtures', () => {
  it('should throw if folder "__testfixtures__" doesn\'t exist', async () => {
    await expect(
      defineTestForFixtures({ dirName, transformName: 'testTransform' }),
    ).rejects.toEqual(`'${testfixturesDir}' folder not found`);
  });

  describe('running fixures', () => {
    beforeAll(() => {
      if (!fs.existsSync(fixturesFolder)) {
        fs.mkdirSync(fixturesFolder);
      }

      for (const transformName of transforms) {
        const transform = `${transformName}.js`;
        const transformPath = path.join(dirName, transform);

        fs.writeFileSync(
          transformPath,
          `module.exports = function ${transformName}() {
            return '${transformName}';
          }\n`,
        );
      }

      for (const transformName of transforms) {
        for (const fixtureType of ['input', 'output']) {
          const fixtureName = `${transformName}.${fixtureType}.js`;
          fs.writeFileSync(
            path.join(fixturesFolder, fixtureName),
            `const ${transformName} = '${fixtureName}';\n`,
          );
        }
      }
    });

    afterAll(() => {
      for (const transformName of transforms) {
        const fixtureName = `${transformName}.js`;
        fs.unlinkSync(path.join(dirName, fixtureName));
      }

      fs.rmSync(fixturesFolder, { recursive: true });
    });

    it('should be called "runInlineTest" with options', async () => {
      await defineTestForFixtures({ dirName, transformName: 'foo' });
      expect(runInlineTest).toHaveBeenCalled();

      const mockRunInlineTest = runInlineTest as unknown as Mock<typeof runInlineTest>;

      expect(typeof mockRunInlineTest.mock.calls[0][0]).toBe('function');

      expect(mockRunInlineTest.mock.calls[0][1]).toBe(undefined);

      expect(mockRunInlineTest.mock.calls[0][2]).toStrictEqual({
        path: `${fixturesFolder}/foo.input.js`,
        source: "const foo = 'foo.input.js';\n",
      });

      expect(mockRunInlineTest.mock.calls[0][3]).toBe("const foo = 'foo.output.js';\n");

      expect(mockRunInlineTest.mock.calls[0][4]).toBe(undefined);
    });

    it('should throw if transformName is not correct', async () => {
      const transformName = 'testTransform';
      const errorMessage = `ENOENT: no such file or directory, open '${fixturesFolder}/${transformName}.input.js'`;

      await expect(defineTestForFixtures({ dirName, transformName })).rejects.toEqual(
        expect.objectContaining({
          message: errorMessage,
        }),
      );

      // expect(() => {
      //   defineTestForFixtures({ dirName, transformName });
      // }).toThrow();
    });
  });
});
