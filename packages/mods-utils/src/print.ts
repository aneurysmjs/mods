import jscodeshift from 'jscodeshift';
import type { ASTPath, ASTNode, Collection } from 'jscodeshift';

type Node = ASTNode[] | ASTPath | ASTPath[] | Collection;

const isCollection = (val: object): val is Collection => {
  return 'get' in val;
};

export default function print(nodeOrPath: Node) {
  if (isCollection(nodeOrPath)) {
    const node = nodeOrPath.get() as string;

    console.log('source: \n\n', jscodeshift(node).toSource());
  } else {
    console.warn('no collection');
  }
}
