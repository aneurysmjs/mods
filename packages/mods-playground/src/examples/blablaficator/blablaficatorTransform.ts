import type { FileInfo, API } from 'jscodeshift';

export default function blablaficatorTransform(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  return j(fileInfo.source).find(j.Identifier).replaceWith(j.identifier('bla')).toSource();
}
