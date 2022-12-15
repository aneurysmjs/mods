import * as j from 'jscodeshift'
import type { API, FileInfo, JSXElement, JSXAttribute } from 'jscodeshift';

type JSXAttributeParam = Parameters<typeof j.jsxAttribute>;

export type AttributeTuple = [string, JSXAttributeParam['1']];

export interface ComponentModAPI {
  name: string;
  attributes: [AttributeTuple];
}

/**
 *
 * @param {AttributeTuple} attribute
 * @returns {JSXAttribute}
 */
const makeJSXAttribute = (attribute: AttributeTuple): JSXAttribute => {
  if (!Array.isArray(attribute)) {
    throw new Error('attr must be an array');
  }

  if (attribute.length > 2) {
    throw new Error('attr should contain only 2 items');
  }

  return j.jsxAttribute(j.jsxIdentifier(attribute[0]), attribute[1]);
};

/**
 *
 * @param {Array<AttributeTuple>} attributes
 * @return {Array<JSXAttribute>}
 */
const makeJSXAttributes = (attributes: Array<AttributeTuple>) => attributes.map(makeJSXAttribute);

/**
 *
 * @param {string} name name of the JSX element
 * @param {Array<AttributeTuple>} attrs
 * @return {JSXElement}
 */
const makeJSXElement = (name: string, attrs: Array<AttributeTuple>): JSXElement => {
  const attributes = makeJSXAttributes(attrs);

  const opening = j.jsxOpeningElement(j.jsxIdentifier(name), attributes, true);

  const element = j.jsxElement(opening);

  return element;
};

/**
 * @return {(fileInfo: FileInfo, api: API) => string}
 */
export const makeComponent = ({ name, attributes }: ComponentModAPI) => (
  fileInfo: FileInfo,
  api: API,
): string => {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);

  const result = root.findJSXElements('Menu');

  const button = makeJSXElement(name, attributes);

  const jsxText = j.jsxText('\n');

  result.get().value.children = [...result.get().value.children, button, jsxText];

  return result.toSource({ trailingComma: true });
};
