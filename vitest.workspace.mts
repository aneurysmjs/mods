/// <reference types="vitest" />
import { defineWorkspace } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const packages = path.resolve(dirname, 'packages');

function getFoldersSync(dirPath: string) {
  const files = fs.readdirSync(dirPath);
  const folders = files.filter((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    return stats.isDirectory();
  });

  return folders;
}

export default defineWorkspace([
  ...getFoldersSync(packages).map((packageName) => ({
    test: {
      name: packageName,
    },
    exclude: ['**/node_modules/**', './src/**/*'],
  })),
]);
