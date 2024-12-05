import { objectExpression, property, type Property, type ObjectExpression } from 'jscodeshift';

type PropertyParams = Parameters<typeof property>;

type ObjectKind = PropertyParams['0'];
type ObjectKey = PropertyParams['1'];
type ObjectValue = PropertyParams['2'];

export interface ObjectProperty {
  kind?: ObjectKind;
  key: ObjectKey;
  value: ObjectValue;
}

export interface ObjectData {
  properties: ObjectProperty[];
}

export function makeObjectProperty({ kind = 'init', key, value }: ObjectProperty): Property {
  return property(kind, key, value);
}

export function makeObjectProperties(properties: ObjectProperty[]) {
  return properties.map(makeObjectProperty);
}

export function makeObjectExpression({ properties }: ObjectData) {
  return objectExpression(makeObjectProperties(properties));
}
