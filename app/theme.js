/* eslint-disable key-spacing */

import { Navigator } from 'react-native';

// color
const color = {
	blue: '#00A8D8',
	gray: '#666',
	text: '#383838',
	viewBg: '#F4F4F4',
};

// font sizes
const fontSize = {
	xsmall:  12,
	small:   14,
	default: 17,
	large:   24,
};

// header
const header = {
	backgroundColor: color.viewBg,
	buttonColor: color.blue,
	textColor: color.text,
};

// navigator config
const navigatorConfig = {
	HorizontalSwipeJump: {
		...Navigator.SceneConfigs.HorizontalSwipeJump,
		gestures: {},
	},
	FloatFromBottom: {
		...Navigator.SceneConfigs.FloatFromBottom,
		gestures: {},
	},
};

export default {
	color,
	fontSize,
	header,
	navigatorConfig,
};
