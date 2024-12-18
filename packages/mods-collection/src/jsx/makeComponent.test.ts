import { describe, it, expect } from 'vitest';
import { applyTransform } from 'jscodeshift/dist/testUtils';
import { literal } from 'jscodeshift';

  import { makeComponent, ComponentModAPI } from './makeComponent.js';

const transformOptions = {};

describe('makeComponent', () => {
  it('should add a new <Button /> component', () => {
    const data: ComponentModAPI = {
      name: 'Button',
      attributes: [['text', literal('other')]],
    };

    const source = `
    <Sidebar>
      <Menu>
        <Button text="click" />
        <Button text="submit" />
      </Menu>
    </Sidebar>
    `;

    const output = `
    <Sidebar>
      <Menu>
        <Button text="click" />
        <Button text="submit" />
        <Button text="other" />
      </Menu>
    </Sidebar>
    `;

    const expected = applyTransform(makeComponent(data), transformOptions, { source });

    expect(output.trim()).toEqual(expected);
  });
});
