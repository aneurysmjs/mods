// @ts-ignore
import { applyTransform } from 'jscodeshift/dist/testUtils';
import {literal} from 'jscodeshift';

import componentMod from '../src/makeComponent';

const transformOptions = {};


describe('makeComponent', () => {
  it('should add a new <Button /> component', () => {
    const data = {
      name: 'Button',
      attributes: [['text', literal('other')]]
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

    //@ts-ignore
    const expected = applyTransform(componentMod(data), transformOptions, { source });

    expect(output.trim()).toEqual(expected);
  });
});
