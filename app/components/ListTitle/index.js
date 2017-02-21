import React, { PropTypes } from 'react';
import { PixelRatio, Text, View } from 'react-native';

import theme from '../../theme';

export default function ListTitle ({ text }) {
	const styles = {
		text: {
			color: theme.color.text,
			fontSize: theme.fontSize.xsmall,
			fontWeight: '500',
			lineHeight: theme.fontSize.large,
		},
		view: {
			backgroundColor: theme.color.viewBg,
			borderBottomColor: theme.color.gray20,
			borderBottomWidth: 1 / PixelRatio.get(),
			paddingHorizontal: theme.fontSize.default,
			paddingTop: theme.fontSize.small,
		},
	};

	return (
		<View style={styles.view}>
			<Text style={styles.text}>{text.toUpperCase()}</Text>
		</View>
	);
};

ListTitle.propTypes = {
	text: PropTypes.string.isRequired,
};
