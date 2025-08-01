/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { FileInfo, API, SpreadElement, Expression } from 'jscodeshift';

function isThisBrowser(node: SpreadElement | Expression) {
  // @ts-expect-error
  return node.object && node.object.type === 'ThisExpression' && node.property.name === 'browser';
}

export default function updateLibTransform(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  function buildProperty(name: string, value: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return j.property('init', j.identifier(name), j.literal(value));
  }

  return j(fileInfo.source)
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'ThisExpression',
        },
        property: {
          name: 'createPageObject',
        },
      },
    })
    .replaceWith((nodePath) => {
      const { node } = nodePath;
      const { arguments: args } = node;

      if (args.length === 1) {
        return node;
      }

      if (isThisBrowser(args[1])) {
        node.arguments = [args[0]];

        return node;
      }

      // @ts-expect-error
      args[1] = j.objectExpression([buildProperty('parent', args[1].value)]);

      return node;
    })
    .toSource();
}
