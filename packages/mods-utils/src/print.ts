import * as core from 'jscodeshift/src/core';
import type { ASTPath, ASTNode, Collection } from 'jscodeshift';

export default function print(nodeOrPath: ASTNode[] | ASTPath | ASTPath[] | Collection) {
  // @ts-ignore
  console.log('source: \n\n', core(nodeOrPath.get()).toSource());
}
