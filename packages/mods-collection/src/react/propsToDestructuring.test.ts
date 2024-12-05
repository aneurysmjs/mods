import { describe, it, expect } from 'vitest';
import { applyTransform } from 'jscodeshift/dist/testUtils';
import { format } from '@mods/utils';

import propsToDestucturing from './propsToDestructuring.js';

const transformOptions = {};

describe('props to destructuring', () => {
  it('extracts from `this.props` into a destructured variable declaration', () => {
    const source = `
    class C extends React.Component() {
      render() {
        return <div foo={this.props.foo} bar={this.props.bar} />;
      }
    }
    `;

    const output = `
    class C extends React.Component() {
      render() {
        const { bar, foo } = this.props;
        return <div foo={foo} bar={bar} />;
      }
    }
    `;

    const expected = applyTransform(propsToDestucturing, transformOptions, { source });

    expect(format(output)).toEqual(format(expected));
  });
});
