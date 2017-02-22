import React, { PropTypes } from 'react';
import { Image, ScrollView, View } from 'react-native';

import theme from '../../theme';

export default function Scene ({ scroll, style, ...props }) {
	const styles = [{ flex: 1 }, style];
	const Tag = scroll ? ScrollView : View;

	return <Tag style={styles} {...props} />;
};

Scene.propTypes = {
	scroll: PropTypes.bool,
};
