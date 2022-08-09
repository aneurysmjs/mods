import assert from 'node:assert';
import path from 'node:path';
import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'graceful-fs';
import stripJsonComments from 'strip-json-comments';

import { appendTsConfigJson } from '../config/utils.mjs';
import { getPackagesWithTsConfig } from './buildUtils.mjs';

(async () => {
  const packagesWithTs = getPackagesWithTsConfig();

  /**
   *  single string contaning information about project's workspaces
   *
   * "{"location":".","name":"@mods/monorepo"}
   *  {"location":"packages/mods-pkg1","name":"@mods/pkg1"}
   *  {"location":"packages/mods-pkg2","name":"@mods/pkg2"}
   *  {"location":"packages/mods-pkg3","name":"@mods/pkg3"}"
   */
  const { stdout: allWorkspacesString } = await execa('yarn', ['workspaces', 'list', '--json']);

  /**
   * Transform to a JSON array
   *
   * [
   *   { location: '.', name: '@mods/monorepo' },
   *   { location: 'packages/mods-pkg1', name: '@mods/pkg1' },
   *   { location: 'packages/mods-pkg2', name: '@mods/pkg2' },
   *   { location: 'packages/mods-pkg3', name: '@mods/pkg3' }
   * ]
   */
  const allWorkspaces = JSON.parse(`[${allWorkspacesString.split('\n').join(',')}]`);

  /**
   * Transform to a Map only containing the packages that its location
   * ends with its corresponding package directory absolute path
   *
   * Map {
   *  '@mods/pkg1' => 'packages/mods-pkg1',
   *  '@mods/pkg2' => 'packages/mods-pkg2',
   *  '@mods/pkg3' => 'packages/mods-pkg3'
   * }
   */
  const workspacesWithTs = new Map(
    allWorkspaces
      .filter(({ location }) =>
        packagesWithTs.some(({ packageDir }) => packageDir.endsWith(location)),
      )
      .map(({ name, location }) => [name, location]),
  );

  /**
   * Iterate each package and make assertions against root's package.json
   */
  packagesWithTs.forEach(({ packageDir, pkg }) => {
    assert.ok(pkg.types, `Package ${pkg.name} is missing \`types\` field`);

    assert.strictEqual(
      pkg.types,
      pkg.main.replace(/\.js$/, '.d.ts'),
      `\`main\` and \`types\` field of ${pkg.name} does not match`,
    );

    /**
     * Track which workspace has dependencies from other workspace and get its
     * relative path
     */
    const jestDependenciesOfPackage = Object.keys(pkg.dependencies || {})
      .concat(Object.keys(pkg.devDependencies || {}))
      /**
       * If the dependency exists on the workspaces Map, it meanse that the current
       * workspace depends on another workspace
       */
      .filter((dep) => workspacesWithTs.has(dep))
      /**
       * packageDir:     /Users/path/to/monorepo/mods/packages/pkg-2
       * dependency:     packages/pkg-1
       * point to pkg-1: /Users/path/to/monorepo/mods/packages/pkg-2../../packages/pkg-1
       * relative:       ../pkg-1
       */
      .map((dep) => path.relative(packageDir, `${packageDir}/../../${workspacesWithTs.get(dep)}`))
      .sort();

    if (jestDependenciesOfPackage.length > 0) {
      const tsConfig = JSON.parse(
        stripJsonComments(fs.readFileSync(appendTsConfigJson(packageDir), 'utf8')),
      );

      const references = tsConfig.references.map(({ path }) => path);

      assert.deepStrictEqual(
        references,
        jestDependenciesOfPackage,
        `Expected declared references to match dependencies in package ${
          pkg.name
        }. Got:\n\n${references.join('\n')}\nExpected:\n\n${jestDependenciesOfPackage.join('\n')}`,
      );
    }
  });

  const args = [
    'tsc',
    '-b',
    ...packagesWithTs.map(({ packageDir }) => packageDir),
    ...process.argv.slice(2),
  ];

  console.log(chalk.inverse(' Building TypeScript definition files '));

  try {
    await execa('yarn', args, { stdio: 'inherit' });
    console.log(chalk.inverse.green(' Successfully built TypeScript definition files '));
  } catch (e) {
    console.error(chalk.inverse.red(' Unable to build TypeScript definition files '));
    throw e;
  }
})().catch((error) => {
  console.error('Got error', error.stack);
  process.exitCode = 1;
});
