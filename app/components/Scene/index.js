import React, { PropTypes } from 'react';
import { Image, ScrollView, View } from 'react-native';

import theme from '../../theme';

export default function Scene ({ scroll, style, ...props }) {
	const styles = Object.assign({
		backgroundColor: theme.color.viewBg,
		flexGrow: 1,
		flexShrink: 1,
		shadowColor: 'black',
		shadowOffset: { height: 1, width: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 12,
	}, style);
	const Tag = scroll ? ScrollView : View;

	return <Tag style={styles} {...props} />;
};

Scene.propTypes = {
	scroll: PropTypes.bool,
};
