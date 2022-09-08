import assert from 'node:assert';
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'graceful-fs';

import { PACKAGE_JSON } from '../config/const.mjs';
import { PACKAGES_DIR } from '../config/paths.mjs';
import {
  isDirWithTsConfigJson,
  appendPackageJson,
  makePkgExports,
  runAssertions,
  indexEntries,
  getIndexExt,
} from '../config/utils.mjs';

export const getPackages = () => {
  const packages = fs
    .readdirSync(PACKAGES_DIR)
    .map((file) => path.resolve(PACKAGES_DIR, file))
    .filter((f) => fs.lstatSync(path.resolve(f)).isDirectory())
    .filter((f) => fs.existsSync(path.join(path.resolve(f), PACKAGE_JSON)));

  const require = createRequire(import.meta.url);

  const rootPackage = require('../package.json');

  const nodeEngineRequirement = rootPackage.engines.node;

  return packages.map((packageDir) => {
    const pkg = JSON.parse(fs.readFileSync(appendPackageJson(packageDir), 'utf8'));

    assert.ok(pkg.engines, `Engine requirement in "${pkg.name}" should exist`);

    assert.strictEqual(
      pkg.engines.node,
      nodeEngineRequirement,
      `Engine requirement in "${pkg.name}" should match root`,
    );

    assert.ok(pkg.exports, `Package "${pkg.name}" is missing \`exports\` field`);

    assert.deepStrictEqual(
      pkg.exports,
      makePkgExports(pkg),
      `Package "${pkg.name}" does not export correct files`,
    );

    if (pkg.types) {
      runAssertions(indexEntries(pkg), pkg);
    } else {
      const indexExt = getIndexExt(pkg);

      assert.strictEqual(
        pkg.main,
        `./${indexExt}`,
        `Package "${pkg.name}" should have "./${indexExt}" as main`,
      );
    }

    if (pkg.bin) {
      Object.entries(pkg.bin).forEach(([binName, binPath]) => {
        const fullBinPath = path.resolve(packageDir, binPath);

        if (!fs.existsSync(fullBinPath)) {
          throw new Error(
            `Binary in package "${pkg.name}" with name "${binName}" at ${binPath} does not exist`,
          );
        }
      });
    }

    return { packageDir, pkg };
  });
};

export const getPackagesWithTsConfig = () =>
  getPackages().filter((p) => isDirWithTsConfigJson(p.packageDir));
