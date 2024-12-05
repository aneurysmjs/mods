import { objectExpression, ObjectExpression } from 'jscodeshift';

import makeObjectProperty, { PropertyValue } from './makeObjectProperty';

export interface MakeObjectExpression {
  key: string;
  value: PropertyValue;
}

export default function makeObjectExpression({
  key,
  value,
}: MakeObjectExpression): ObjectExpression {
  return objectExpression([makeObjectProperty(key, value)]);
}
