import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Talk from '../../../../app/scenes/Schedule/components/Talk';

describe('Schedule - Talk', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<Talk onPress={() => {}} />
		).toJSON();

		expect(tree).toMatchSnapshot();
	});
});
