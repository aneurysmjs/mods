/** @typedef {import('jscodeshift').FileInfo} FileInfo */
/** @typedef {import('jscodeshift').API} API */

/**
 *
 * @param {API['jscodeshift']} j
 * @return {(node: any) => void}
 */
const print = (j) => (collection) => {
  console.log('source ma nigga: \n\n', j(collection.get()).toSource());
};

/**
 * @function component
 * @return {(fileInfo: FileInfo, api: API) => string}
 */
const component = () => (fileInfo, api) => {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);

  const result = root.findJSXElements('Menu');

  const attribute = j.jsxAttribute(j.jsxIdentifier('text'), j.literal('other'));

  const attributes = [attribute];

  const opening = j.jsxOpeningElement(j.jsxIdentifier('Button'), attributes, true);

  const button = j.jsxElement(opening);

  const jsxText = j.jsxText('\n');

  result.get().value.children = [...result.get().value.children, button, jsxText];

  return result.toSource({ trailingComma: true });
};

export default component;
