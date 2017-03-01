import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Pane from '../../../../app/scenes/Talk/components/Pane';
import talks from '../../../../app/data/talks';

describe('Talk - Pane', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<Pane
				nextTalk={talks[0]}
				onHeroLayout={() => {}}
				onScroll={() => {}}
				onScrollEndDrag={() => {}}
				prevTalk={talks[0]}
				showSpeakerModal={() => {}}
				visibleTalk={talks[0]}
			/>
		).toJSON();

		expect(tree).toMatchSnapshot();
	});
});
