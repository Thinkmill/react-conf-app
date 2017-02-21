import React, { Component, PropTypes } from 'react';
import { Image, PixelRatio, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Avatar from '../../../../components/Avatar';
import theme from '../../../../theme';

export default function Organiser ({
	avatar,
	name,
	onPress,
	summary,
}) {
	return (
		<TouchableHighlight onPress={onPress} underlayColor={theme.color.gray05} activeOpacity={1} style={styles.touchable}>
			<View style={styles.base}>
				<Avatar source={avatar} />
				<View style={styles.text}>
					<Text style={styles.title}>{name}</Text>
					<Text style={styles.subtitle}>{summary}</Text>
				</View>
			</View>
		</TouchableHighlight>
	);
};

Organiser.propTypes = {
	avatar: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
	summary: PropTypes.string.isRequired,
};
Organiser.defaultProps = {
	onPress: () => {},
};

const styles = StyleSheet.create({
	touchable: {
		backgroundColor: 'white',
	},
	base: {
		alignItems: 'center',
		borderBottomColor: theme.color.gray20,
		borderBottomWidth: 1 / PixelRatio.get(),
		flexDirection: 'row',
		flexGrow: 1,
		flexShrink: 1,
		padding: theme.fontSize.default,
	},

	// content\
	text: {
		flexGrow: 1,
		flexShrink: 1,
		paddingLeft: theme.fontSize.default,
	},
	subtitle: {
		color: theme.color.gray60,
		fontSize: theme.fontSize.small,
		fontWeight: '300',
		marginBottom: theme.fontSize.small,
	},
	title: {
		color: theme.color.text,
		fontSize: theme.fontSize.default,
	},
});
