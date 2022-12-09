import commandParser from './commandParser.mjs';
import { PACKAGES_DIR } from '../paths.mjs';
import { importJSON, appendPackageJson } from '../utils.mjs';
import * as fs from 'node:fs';

/** @type {{name: string}} */
const options = commandParser(process.argv);
const pkgWithPackageJSON = appendPackageJson(`${PACKAGES_DIR}/${options.name}`);
const pkg = importJSON(pkgWithPackageJSON);

const pkgNameCLI = `${options.name}-cli`;
const pkgPathToBinDir = `${PACKAGES_DIR}/${options.name}/bin`;
const pkgPathToBinFile = `./bin/${pkgNameCLI}`;
const binContent = "import 'mods-cli/bin/mods-cli'\n";

(() => {
  if (pkg.bin) {
    console.warn(`package ${options.name} already has a bin property`);
    return;
  }

  pkg.bin = {
    [pkgNameCLI]: `./bin/${pkgNameCLI}.js`,
  };

  if (pkg.exports[pkgPathToBinFile]) {
    console.warn(
      `package ${options.name} already has "./bin/${pkgNameCLI}" in its "exports" property`,
    );
    return;
  }

  pkg.exports[pkgPathToBinFile] = `${pkgPathToBinFile}.js`;

  fs.writeFileSync(pkgWithPackageJSON, JSON.stringify(pkg, null, 2));

  if (fs.existsSync(pkgPathToBinDir)) {
    console.warn(`package ${options.name} already has a bin folder`);
    return;
  }

  fs.mkdirSync(pkgPathToBinDir);
  fs.writeFileSync(`${pkgPathToBinDir}/${pkgNameCLI}.js`, binContent);
})();
