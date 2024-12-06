import {
  type FileInfo,
  type API,
  type Identifier,
  type ASTPath,
  type MemberExpression,
  type Expression,
  type Property,
  type VariableDeclaration,
} from 'jscodeshift';
import { print } from '@mods/utils';

type KeywordMap = Record<string, boolean>;

/**
 * @see https://github.com/benjamn/ast-types/blob/master/src/scope.ts#L7
 */
interface Scope {
  path: ASTPath;
  node: any;
  isGlobal: boolean;
  depth: number;
  parent: any;
  bindings: any;
  types: any;
  didScan: boolean;
  declares(name: any): any;
  declaresType(name: any): any;
  declareTemporary(prefix?: any): any;
  injectTemporary(identifier: any, init: any): any;
  scan(force?: any): any;
  getBindings(): Record<string, []>;
  getTypes(): any;
  lookup(name: string): Scope | null;
  lookupType(name: string): {
    getTypes: Scope['getTypes'];
  };
  getGlobalScope(): Scope;
}

const KEYWORDS =
  'this function if return var else for new in typeof while case break try catch delete throw switch continue default instanceof do void finally with debugger implements interface package private protected public static class enum export extends import super true false null abstract boolean byte char const double final float goto int long native short synchronized throws transient volatile';

const KEYWORDS_MAP = KEYWORDS.split(' ').reduce<KeywordMap>((f, k) => {
  f[k] = true;

  return f;
}, {});

const isKeyword = (k: string) => KEYWORDS_MAP.hasOwnProperty(k);

const isIdentifier = (node: Identifier | Expression): node is Identifier => 'name' in node;

const getPropertyName = (path: ASTPath<MemberExpression>) => {
  if (isIdentifier(path.value.property)) {
    return path.value.property.name;
  }

  return '';
};

/**
 * @link https://github.com/jhgg/js-transforms/blob/master/props-to-destructuring.js
 */
export default function propsToDestucturing(file: FileInfo, api: API) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.FunctionExpression)
    .replaceWith((functionExpressionPath) => {
      const root = j(functionExpressionPath.value);

      const variablesToReplace: Record<string, boolean> = {};

      // Figure out if the variable was defined from props, so that we can re-use that definition.
      const isFromProps = (name: string, resolvedScope: Scope): boolean => {
        // @ts-ignore
        console.log('resolvedScope.getBindings()[name]', resolvedScope.getBindings()[name]);

        return resolvedScope.getBindings()[name].every((p) => {
          const decl = j(p).closest(j.VariableDeclarator);
          // What happens when our VariableDeclarator is too high up the parent AST?

          if (!decl.size()) {
            return false;
          }

          const node = decl.nodes()[0];

          if (
            !(
              node.init?.type == 'MemberExpression' &&
              node.init.object.type == 'ThisExpression' &&
              (node.init.property as Identifier).name == 'props'
            )
          )
            return false;

          // Check for the case where it could be aliased (i.e.) { baz: foo } = this.props;
          // In this case, we won't do a substitution.
          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (p.parentPath.value.type == 'Property' && p.parentPath.value.key.name !== name) {
            return false;
          }

          return true;
        });
      };

      // Transform "this.props.xyz" to "xyz", and record what we've transformed.
      // Transform as long as we don't have "xyz" already defined in the scope.
      root
        .find(j.MemberExpression, {
          object: {
            type: 'MemberExpression',
            object: { type: 'ThisExpression' },
            property: { name: 'props' },
          },
        })
        .filter((memberExpressionPath) => {
          const scope = memberExpressionPath.scope as Scope;

          const resolvedScope = scope.lookup(
            (memberExpressionPath.value.property as Identifier).name,
          );

          // If the scope is null, that means that this property isn't defined in the scope yet,
          // and we can use it. Otherwise, if it is defined, we should see if it was defined from `this.props`
          // if none of these cases are true, we can't do substitution.
          return (
            resolvedScope == null ||
            isFromProps(getPropertyName(memberExpressionPath), resolvedScope)
          );
        })
        // Ensure that our substitution won't cause us to define a keyword, i.e. `this.props.while` won't
        // get converted into `while`.
        .filter((p) => !isKeyword((p.value.property as Identifier).name))
        // Now, do the replacement, `this.props.xyz` => `xyz`.
        .replaceWith((p) => p.value.property)
        // Finally, mark the variable as something we will need to define earlier in the function,
        // if it's not already defined.
        .forEach((p) => {
          // Is this prop already defined somewhere else.
          if (!(p.scope as Scope).lookup((p.value as Identifier).name)) {
            variablesToReplace[(p.value as Identifier).name] = true;
          }
        });

      // Create property definitions for variables that we've replaced.
      const properties = Object.keys(variablesToReplace)
        .sort()
        .map((k) => {
          const prop = j.property('init', j.identifier(k), j.identifier(k));
          prop.shorthand = true;
          return prop;
        });

      // We have no properties to inject, so we can bail here.
      if (!properties.length) {
        return functionExpressionPath.value;
      }

      // See if we already have a VariableDeclarator like { a, b, c } = this.props;
      const propDefinitions = root.find(j.VariableDeclarator, {
        id: { type: 'ObjectPattern' },
        init: {
          type: 'MemberExpression',
          object: { type: 'ThisExpression' },
          property: { name: 'props' },
        },
      });

      if (propDefinitions.size()) {
        const nodePath = propDefinitions.paths()[0];
        const node = nodePath.value;

        // @ts-ignore
        const newPattern = j.objectPattern((node.id.properties as Property[]).concat(properties));

        nodePath.replace(j.variableDeclarator(newPattern, node.init));
        return functionExpressionPath.value;
      }

      // Otherwise, we'll have to create our own, as none were suitable for use.
      // Create the variable definition `const { xyz } = this.props;`
      const decl = j.template
        .statement`const { ${properties} } = this.props;` as VariableDeclaration;

      // Add the variable definition to the top of the function expression body.
      return j.functionExpression(
        functionExpressionPath.value.id,
        functionExpressionPath.value.params,
        // @ts-ignore
        j.blockStatement([decl].concat(functionExpressionPath.value.body.body)),
      );
    })
    .toSource();
}
