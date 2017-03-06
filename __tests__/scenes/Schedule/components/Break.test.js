// @flow
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Break from '../../../../app/scenes/Schedule/components/Break';

describe('Schedule - Break', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Break status="present" important={false} title="" />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
