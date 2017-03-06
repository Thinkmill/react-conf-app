// @flow
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Info from '../../../app/scenes/Info';

describe('Info', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Info navigator={{}} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
