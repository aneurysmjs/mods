import type { FileInfo, API } from 'jscodeshift';

export default function deleteConsoleLogTransform(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  return j(fileInfo.source)
    .find(j.CallExpression, {
      callee: {
        object: {
          name: 'console',
        },
        property: {
          name: 'log',
        },
      },
    })
    .remove()
    .toSource();
}
