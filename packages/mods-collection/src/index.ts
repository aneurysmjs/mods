import type { Transform, Parser } from 'jscodeshift';

import { makeComponent } from './jsx/makeComponent.js';

interface JSTransformationModule {
  default: Transform;
  parser?: string | Parser;
}

const transformationMap: Record<string, JSTransformationModule> = {
  ...makeComponent,
};

export default transformationMap;
