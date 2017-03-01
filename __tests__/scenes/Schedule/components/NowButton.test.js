import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import NowButton from '../../../../app/scenes/Schedule/components/NowButton';

describe('Schedule - Now Button', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<NowButton onPress={() => {}} />
		).toJSON();

		expect(tree).toMatchSnapshot();
	});
});
