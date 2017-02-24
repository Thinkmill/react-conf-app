import React, { PropTypes } from 'react';
import { PixelRatio, Text, View } from 'react-native';

import theme from '../../theme';

export default function ListTitle ({ bordered, text }) {
	const styles = {
		text: {
			color: theme.color.text,
			fontSize: theme.fontSize.xsmall,
			fontWeight: '500',
			lineHeight: theme.fontSize.large,
		},
		view: {
			backgroundColor: theme.color.sceneBg,
			borderBottomColor: theme.color.gray20,
			borderBottomWidth: 1 / PixelRatio.get(),
			paddingHorizontal: theme.fontSize.default + 6,
			height: theme.listheader.height,
			justifyContent: 'flex-end',
		},
		view__bordered: {
			borderTopColor: theme.color.gray20,
			borderTopWidth: 1 / PixelRatio.get(),
		},
	};

	return (
		<View style={[styles.view, bordered && styles.view__bordered]}>
			<Text style={styles.text}>{text.toUpperCase()}</Text>
		</View>
	);
};

ListTitle.propTypes = {
	bordered: PropTypes.bool,
	text: PropTypes.string.isRequired,
};
