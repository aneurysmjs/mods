import { objectExpression } from 'jscodeshift';

import makeObjectProperty, { PropertyValue } from './makeObjectProperty';

export interface MakeObjectExpression {
  key: string;
  value: PropertyValue;
}

export default function makeObjectExpression({ key, value }: MakeObjectExpression) {
  return objectExpression([makeObjectProperty(key, value)]);
}
