// @flow
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Speaker from '../../../../app/scenes/Talk/components/Speaker';

describe('Talk - Speaker', () => {
	it('renders correctly with missing github and twitter', () => {
		const tree = renderer.create(
			<Speaker
				avatar="avatar"
				name="Max Stoiber"
				onClose={() => {}}
				summary="This is my summary."
			/>
		).toJSON();

		expect(tree).toMatchSnapshot();
	});
	it('renders correctly with all props', () => {
		const tree = renderer.create(
			<Speaker
				avatar="avatar"
				github="github"
				name="Max Stoiber"
				onClose={() => {}}
				summary="This is my summary."
				twitter="twitter"
			/>
		).toJSON();

		expect(tree).toMatchSnapshot();
	});
});
