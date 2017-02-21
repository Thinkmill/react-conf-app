/* eslint-disable key-spacing */

import { Navigator } from 'react-native';

// color
const color = {
	blue:                '#00A8D8',
	green:               '#9BE13A',
	text:                '#383838',
	viewBg:              '#F4F4F4',

	// neutrals
	gray90:              '#1A1A1A',
	gray80:              '#333',
	gray70:              '#4D4D4D',
	gray60:              '#666',
	gray50:              '#7F7F7F',
	gray40:              '#999',
	gray35:              '#a6a6a6',
	gray30:              '#B3B3B3',
	gray25:              '#bfbfbf',
	gray20:              '#CCC',
	gray15:              '#D9D9D9',
	gray10:              '#E5E5E5',
	gray05:              '#F2F2F2',
};

// font sizes
const fontSize = {
	xsmall:  12,
	small:   14,
	default: 17,
	large:   24,
	xlarge:  32,
};

// header
const header = {
	backgroundColor: color.viewBg,
	buttonColor: color.blue,
	textColor: color.text,
};

export default {
	color,
	fontSize,
	header,
};
