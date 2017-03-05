// @flow
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import CodeOfConduct from '../../../../app/scenes/Info/components/CodeOfConduct';

describe('Info - Code of Conduct', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<CodeOfConduct onClose={() => {}} />
		).toJSON();

		expect(tree).toMatchSnapshot();
	});
});
