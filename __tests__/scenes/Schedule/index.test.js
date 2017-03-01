import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Schedule from '../../../app/scenes/Schedule';

describe('Schedule', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<Schedule navigator={{}} />
		).toJSON();

		expect(tree).toMatchSnapshot();
	});
});
