import path from 'node:path';
import fs from 'node:fs';

import { PACKAGES_DIR } from '../config/paths.mjs';

/**
 *
 * @param {string} dir
 * @param {{ oldSrc: string, newSrc:string }[]} fileList
 * @returns
 */
const listDir = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      fileList = listDir(path.join(dir, file), fileList);
    } else if (/\.ts$/.test(file)) {
      const name = file.replace(/\.(ts)/, '.mts');
      const src = path.join(dir, file);
      const newSrc = path.join(dir, name);

      fileList.push({
        oldSrc: src,
        newSrc,
      });
    }
  });

  return fileList;
};

const foundFiles = listDir(PACKAGES_DIR);

foundFiles.forEach((f) => {
  fs.renameSync(f.oldSrc, f.newSrc);
});
