import { ASTNode, BlockStatement, ReturnStatement } from 'jscodeshift';

import { isBlockStatement, isReturnStatement } from './types';

export const isBlockStatementNode = (node: ASTNode): node is BlockStatement =>
  isBlockStatement(node.type);

export const isReturnStatementNode = (node: ASTNode): node is ReturnStatement =>
  isReturnStatement(node.type);
