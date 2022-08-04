import { property, identifier } from 'jscodeshift';

export type PropertyValue = Parameters<typeof property>[2];

export default function makeObjectProperty(key: string, value: PropertyValue) {
  return property('init', identifier(key), value);
}
