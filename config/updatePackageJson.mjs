import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'graceful-fs';

import { PACKAGE_JSON } from './const.mjs';
import { getPackages } from './utils.mjs';

const requireFn = createRequire(import.meta.url);

const rootPackage = requireFn(`../${PACKAGE_JSON}`);

/**
 *
 * @param {string} packageDir
 * @param {object} pkg
 */
const writePackageJson = (packageDir, pkg) => {
  fs.writeFileSync(path.resolve(packageDir, PACKAGE_JSON), JSON.stringify(pkg, null, 2));
};

/**
 *
 * @param {string} prop
 */
export const updatePackageJson = (prop) => {
  getPackages().forEach((packageDir) => {
    const pkg = requireFn(`${packageDir}/${PACKAGE_JSON}`);

    if (!pkg[prop]) {
      pkg.engines = rootPackage[prop];

      fs.writeFileSync(path.resolve(packageDir, PACKAGE_JSON), JSON.stringify(pkg, null, 2));
    }
  });
};

export const updatePackageJsonEngines = () => {
  updatePackageJson('engines');
};

export const updatePackageJsonExports = () => {
  const exports = {
    '.': {
      default: './build/index.js',
      types: './build/index.d.ts',
    },
    './package.json': './package.json',
  };

  getPackages().forEach((packageDir) => {
    const pkg = requireFn(`${packageDir}/${PACKAGE_JSON}`);

    if (!pkg.exports) {
      pkg.exports = exports;
      writePackageJson(packageDir, pkg);
    }

    if (!pkg.exports['.'].default || !pkg.exports['.'].types) {
      pkg.exports['.'] = exports['.'];

      writePackageJson(packageDir, pkg);
    }
  });
};
