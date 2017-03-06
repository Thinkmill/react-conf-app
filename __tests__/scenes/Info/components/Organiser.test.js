// @flow
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Organiser from '../../../../app/scenes/Info/components/Organiser';

describe('Info - Organiser', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Organiser
          avatar="avatar"
          name="Tes Ting"
          onPress={() => {}}
          summary="We are testing."
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
