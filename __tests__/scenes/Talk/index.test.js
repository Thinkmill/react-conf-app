import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Talk from '../../../app/scenes/Talk';

describe('Talk', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<Talk navigator={{}} />
		).toJSON();

		expect(tree).toMatchSnapshot();
	});
});
