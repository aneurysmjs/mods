import jscodeshift, {
  Collection,
  API,
  FileInfo,
  JSXElement,
  JSXAttribute,
  jsxIdentifier,
  jsxAttribute,
  jsxOpeningElement,
  jsxElement,
} from "jscodeshift";

/**
 *
 * @param {Collection} collection
 * @return {void}
 */
const print = (collection: Collection): void => {
  console.log("source: \n\n", jscodeshift(collection.get()).toSource());
};

type JSXAttributeParam = Parameters<typeof jscodeshift.jsxAttribute>;

export type AttributeTuple = [string, JSXAttributeParam["1"]];

/**
  
 * @param {AttributeTuple} attribute
 * @returns {JSXAttribute}
 */
const makeJSXAttribute = (attribute: AttributeTuple): JSXAttribute => {
  if (!Array.isArray(attribute)) {
    throw new Error("attr must be an array");
  }

  if (attribute.length > 2) {
    throw new Error("attr should contain only 2 items");
  }

  return jsxAttribute(jsxIdentifier(attribute[0]), attribute[1]);
};

/**
 *
 * @param {Array<AttributeTuple>} attributes
 * @return {Array<JSXAttribute>}
 */
const makeJSXAttributes = (attributes: Array<AttributeTuple>) =>
  attributes.map(makeJSXAttribute);

/**
 *
 * @param {string} name name of the JSX element
 * @param {Array<AttributeTuple>} attrs
 * @return {JSXElement}
 */
const makeJSXElement = (
  name: string,
  attrs: Array<AttributeTuple>
): JSXElement => {
  const attributes = makeJSXAttributes(attrs);

  const opening = jsxOpeningElement(jsxIdentifier(name), attributes, true);

  const element = jsxElement(opening);

  return element;
};

interface ComponentAPI {
  name: string;
  attributes: [AttributeTuple];
}

/**
 * @return {(fileInfo: FileInfo, api: API) => string}
 */
const makeComponent = ({ name, attributes }: ComponentAPI) => (
  fileInfo: FileInfo,
  api: API
): string => {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);

  const result = root.findJSXElements("Menu");

  const button = makeJSXElement(name, [["text", j.literal("other")]]);

  const jsxText = j.jsxText("\n");

  result.get().value.children = [
    ...result.get().value.children,
    button,
    jsxText,
  ];

  return result.toSource({ trailingComma: true });
};

export default makeComponent;
