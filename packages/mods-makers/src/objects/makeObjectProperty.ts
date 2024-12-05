import { property, identifier, type Property } from 'jscodeshift';

export type PropertyValue = Parameters<typeof property>[2];

export default function makeObjectProperty(key: string, value: PropertyValue): Property {
  return property('init', identifier(key), value);
}
