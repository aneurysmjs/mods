import { applyTransform } from 'jscodeshift/dist/testUtils';

import componentMod from './component.mjs';

const transformOptions = {};

describe('component', () => {
  it('should add a new <Button /> component', () => {
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

    const expected = applyTransform(componentMod(), transformOptions, { source });

    expect(output.trim()).toEqual(expected);
  });
});
