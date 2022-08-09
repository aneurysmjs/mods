import assert from 'node:assert';
import os from 'node:os';
import path from 'node:path';
import chalk from 'chalk';
import { globby } from 'globby';
import fs from 'graceful-fs';
import pLimit from 'p-limit';

export const validateTsDefinitionFiles = async (packagesWithTs) => {
  if (!packagesWithTs) {
    throw new Error('`packagesWithTs` must be specified as an argument');
  }

  console.log(chalk.inverse(' Validating TypeScript definition files '));

  // we want to limit the number of processes we spawn
  const cpus = Math.max(1, os.cpus().length - 1);

  const typesReferenceDirective = '/// <reference types';
  const typesNodeReferenceDirective = `${typesReferenceDirective}="node" />`;

  try {
    const mutex = pLimit(cpus);
    await Promise.all(
      packagesWithTs.map(({ packageDir, pkg }) =>
        mutex(async () => {
          const buildDir = path.resolve(packageDir, 'build/**/*.d.ts');

          const globbed = await globby([buildDir]);

          const files = await Promise.all(
            globbed.map((file) => Promise.all([file, fs.promises.readFile(file, 'utf8')])),
          );

          const filesWithTypeReferences = files
            .filter(([, content]) => content.includes(typesReferenceDirective))
            .filter((hit) => hit.length > 0);

          const filesWithReferences = filesWithTypeReferences
            .map(([name, content]) => [
              name,
              content
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line.includes(typesReferenceDirective))
                .filter((line) => line !== typesNodeReferenceDirective)
                .join('\n'),
            ])
            .filter(([, content]) => content.length > 0)
            .filter((hit) => hit.length > 0)
            .map(([file, references]) =>
              chalk.red(
                `${chalk.bold(
                  file,
                )} has the following non-node type references:\n\n${references}\n`,
              ),
            )
            .join('\n\n');

          if (filesWithReferences) {
            throw new Error(filesWithReferences);
          }

          const filesWithNodeReference = filesWithTypeReferences.map(([filename]) => filename);

          if (filesWithNodeReference.length > 0) {
            assert.ok(pkg.dependencies, `Package \`${pkg.name}\` is missing \`dependencies\``);
            assert.strictEqual(
              pkg.dependencies['@types/node'],
              '*',
              `Package \`${pkg.name}\` is missing a dependency on \`@types/node\``,
            );
          }
        }),
      ),
    );
  } catch (e) {
    console.error(chalk.inverse.red(' Unable to validate TypeScript definition files '));

    throw e;
  }

  console.log(chalk.inverse.green(' Successfully validated TypeScript definition files '));
};
