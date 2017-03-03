// ==============================
// APP STYLE CONSTANTS
// ==============================

/* eslint-disable key-spacing */

// color
const color = {
	blue:      '#00A8D8',
	green:     '#9BE13A',
	text:      '#383838',
	lightText: 'white',
	sceneBg:   '#F4F4F4',
	splashBg: '#2e2829',

	// neutrals
	gray90:  '#1A1A1A',
	gray80:  '#333',
	gray70:  '#4D4D4D',
	gray60:  '#666',
	gray50:  '#7F7F7F',
	gray40:  '#999',
	gray35:  '#a6a6a6',
	gray30:  '#B3B3B3',
	gray25:  '#bfbfbf',
	gray20:  '#CCC',
	gray15:  '#D9D9D9',
	gray10:  '#E5E5E5',
	gray05:  '#F2F2F2',
};

// font sizes
const fontSize = {
	xsmall:  12,
	small:   14,
	default: 17,
	large:   24,
	xlarge:  32,
};

// Component Specific
// ------------------------------

// navbar
const navbar = {
	backgroundColor: color.splashBg,
	buttonColor: color.blue,
	height: 64,
	textColor: color.sceneBg,
};

// list header
const listheader = {
	height: 34,
};

// next up
const nextup = {
	height: 70,
};

export default {
	color,
	fontSize,
	navbar,
	nextup,
	listheader,
};
