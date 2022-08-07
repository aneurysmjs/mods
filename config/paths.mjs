import path from 'node:path';
import url from 'node:url';

export const ROOT = url.fileURLToPath(new URL('../', import.meta.url));

export const PACKAGES_DIR = path.resolve(ROOT, 'packages');

export const TSCONFIG = path.resolve(ROOT, 'tsconfig.json');
