// @ts-ignore
import { applyTransform } from 'jscodeshift/dist/testUtils';
import refactorReactReduxConnect from './refactorReactReduxConnect';
import { format } from '@mods/utils';
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
