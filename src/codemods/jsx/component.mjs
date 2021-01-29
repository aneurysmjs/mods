import jscodeshift from 'jscodeshift';
// console.log('jscodeshift', jscodeshift);
/** @typedef {import('jscodeshift').FileInfo} FileInfo */
/** @typedef {import('jscodeshift').API} API */

/**
 *
 * @param {API['jscodeshift']} j
 * @return {(node: any) => void}
 */
const print = (collection) => {
  console.log('source: \n\n', jscodeshift(collection.get()).toSource());
};

const makeJSXAttribute = (attr) => {
  const j = jscodeshift;
  if (!Array.isArray(attr)) {
    throw new Error('attr must be an array');
  }

  if (attr.length > 2) {
    throw new Error('attr should contain only 2 items');
  }

  return j.jsxAttribute(j.jsxIdentifier(attr[0]), attr[1]);
};

const makeJSXAttributes = (attributes) => attributes.map(makeJSXAttribute);

const makeJSXElement = (name, attrs) => {
  const j = jscodeshift;

  const attributes = makeJSXAttributes(attrs);

  const opening = j.jsxOpeningElement(j.jsxIdentifier(name), attributes, true);

  const element = j.jsxElement(opening);

  return element;
};

/**
 * @function component
 * @return {(fileInfo: FileInfo, api: API) => string}
 */
const component = () => (fileInfo, api) => {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);

  const result = root.findJSXElements('Menu');

  const button = makeJSXElement('Button', [['text', j.literal('other')]]);

  const jsxText = j.jsxText('\n');

  result.get().value.children = [...result.get().value.children, button, jsxText];

  return result.toSource({ trailingComma: true });
};

export default component;
