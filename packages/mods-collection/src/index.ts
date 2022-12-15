import type { Transform, Parser } from 'jscodeshift';

import * as makeComponent from './jsx/makeComponent.js';

type JSTransformationModule = {
  default: Transform;
  parser?: string | Parser;
};
// @ts-ignore
const transformationMap: {
  [name: string]: JSTransformationModule;
} = {
  ...makeComponent,
};

export default transformationMap;
