// @flow
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Talk from '../../../app/scenes/Talk';

const talk = {
	id: '',
	summary: '',
	title: '',
	speaker: {
		avatar: '',
		github: '',
		name: '',
		twitter: '',
		summary: '',
	},
	time: {
		start: new Date(),
		end: new Date(),
	},
};

describe('Talk', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<Talk navigator={{}}
				talk={talk}
				nextTalk={null}
				prevTalk={null}
				introduceUI={false}/>
		).toJSON();

		expect(tree).toMatchSnapshot();
	});
});
