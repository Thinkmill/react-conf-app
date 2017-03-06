// @flow
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Schedule from '../../../app/scenes/Schedule';

const mockNavigator = {
  navigationContext: {
    addListener: () => {},
  },
};

describe('Schedule', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Schedule navigator={mockNavigator} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
