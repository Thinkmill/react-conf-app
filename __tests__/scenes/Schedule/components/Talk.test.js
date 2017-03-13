// @flow
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Talk from '../../../../app/scenes/Schedule/components/Talk';

describe('Schedule - Talk', () => {
  it('renders talk types correctly', () => {
    for (const keynote of [false, true]) {
      for (const lightning of [false, true]) {
        for (const status of ['past', 'present', 'future']) {
          const tree = renderer
            .create(
              <Talk
                keynote={keynote}
                lightning={lightning}
                onPress={() => {}}
                speaker={{
                  name: 'Max Stoiber',
                  twitter: 'mxstbr',
                }}
                startTime="9 AM"
                status={status}
                title="This is a test"
              />
            )
            .toJSON();

          expect(tree).toMatchSnapshot();
        }
      }
    }
  });
});
