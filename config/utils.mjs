import fs from 'node:fs';

import { PACKAGE_JSON } from './const.mjs';

export const importJSON = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'));

/**
 * Takes any path and appends `/package.json` in it
 * 
 * @param {string} path 
 * 
 * @example 
 * 
 * const path = '/some/path';
 * 
 * appendPackageJson(path); 
 * 
 * '/some/path/package.json'
 * 
 */
export const appendPackageJson = (path) => `${path}/${PACKAGE_JSON}`;
