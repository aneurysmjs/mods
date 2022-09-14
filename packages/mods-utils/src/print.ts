import jscodeshift from 'jscodeshift';
import type { ASTPath, ASTNode, Collection } from 'jscodeshift';

export default function print(nodeOrPath: ASTNode[] | ASTPath | ASTPath[] | Collection) {
  // @ts-ignore -> TODO: fix 'get' call typings
  console.log('source: \n\n', jscodeshift(nodeOrPath.get()).toSource());
}
