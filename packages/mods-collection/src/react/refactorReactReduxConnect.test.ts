import { describe, expect, it } from 'vitest';

import { applyTransform } from 'jscodeshift/dist/testUtils';
import { format } from '@mods/utils';
import refactorReactReduxConnect from './refactorReactReduxConnect.js';

const transformOptions = {};

describe('refactor react redux connect', () => {
  it('extracts inline callbacks into "mapStateToProps" and "mapDispatchToProps"', () => {
    const source = `
    connect(
      () => a,
      () => b,
    )(Component);
    `;

    const output = `
    const mapStateToProps = () => a;
    const mapDispatchToProps = () => b;
    connect(mapStateToProps, mapDispatchToProps)(Component);
    `;

    const expected = applyTransform(refactorReactReduxConnect, transformOptions, { source });

    expect(format(output)).toEqual(format(expected));
  });
});
