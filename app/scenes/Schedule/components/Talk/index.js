import React, { Component, PropTypes } from 'react';
import { Image, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import theme from '../../../../theme';

export default function Talk ({
	endTime,
	onPress,
	speakerAvatarUri,
	speakerName,
	startTime,
	title,
}) {
	return (
		<TouchableOpacity onPress={onPress} style={styles.base}>
			<View style={styles.content}>
				<Text style={styles.subtitle}>{startTime} - {speakerName}</Text>
				<Text style={styles.title}>{title}</Text>
			</View>
			<View style={styles.avatar}>
				<Image
					source={{ uri: speakerAvatarUri }}
					style={styles.avatarImage}
				/>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	base: {
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomColor: 'rgba(0, 0, 0, 0.1)',
		borderBottomWidth: 1 / PixelRatio.get(),
		flexDirection: 'row',
		padding: theme.fontSize.default,
	},

	// content
	content: {
		flex: 1,
		paddingRight: theme.fontSize.default,
	},
	subtitle: {
		color: theme.color.gray,
		fontSize: theme.fontSize.small,
	},
	title: {
		color: theme.color.text,
		fontSize: theme.fontSize.default,
	},

	// image
	avatar: {
		backgroundColor: theme.color.viewBg,
		borderRadius: 44,
		overflow: 'hidden',
		height: 44,
		width: 44,
	},
	avatarImage: {
		height: 44,
		width: 44,
	},
});
