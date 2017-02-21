import React, { Component, PropTypes } from 'react';
import { Image, PixelRatio, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Avatar from '../../../../components/Avatar';
import theme from '../../../../theme';

export default function Talk ({
	endTime,
	onPress,
	speakerAvatarUri,
	speakerName,
	startTime,
	status,
	title,
}) {
	const isPast = status === 'past';
	const isPresent = status === 'present';
	const touchableProps = {
		activeOpacity: 1,
		onPress: onPress,
		style: [styles.touchable, styles['touchable__' + status]],
		underlayColor: theme.color.gray05,
	};

	return (
		<TouchableHighlight {...touchableProps}>
			<View style={styles.base}>
				<View style={[styles.statusbar, styles['statusbar__' + status]]}>
					{isPresent && (
						<Icon
							color={theme.color.green}
							name="md-arrow-dropright"
							size={theme.fontSize.large}
							style={styles.statusbarIcon}
						/>
					)}
				</View>

				<View style={styles.content}>
					<View style={[styles.text, styles['text__' + status]]}>
						<Text style={styles.subtitle}>
							{startTime} &mdash; {speakerName}
						</Text>
						<Text style={styles.title}>
							{title}
						</Text>
					</View>

					<View style={styles.right}>
						<Avatar source={speakerAvatarUri} />
						<Icon
							color={theme.color.text}
							name="ios-arrow-forward"
							size={20}
							style={styles.chevron}
						/>
					</View>
				</View>
			</View>
		</TouchableHighlight>
	);
};

Talk.propTypes = {
	endTime: PropTypes.string,
	onPress: PropTypes.func.isRequired,
	speakerAvatarUri: PropTypes.string,
	speakerName: PropTypes.string,
	startTime: PropTypes.string,
	status: PropTypes.oneOf(['future', 'past', 'present']),
	title: PropTypes.string,
};
Talk.defaultProps = {
	status: 'future',
};

const statusbarWidth = 6;
const styles = StyleSheet.create({
	touchable: {
		backgroundColor: 'white',
	},
	touchable__past: {
		opacity: 0.5,
	},
	base: {
		alignItems: 'stretch',
		borderBottomColor: theme.color.gray20,
		borderBottomWidth: 1 / PixelRatio.get(),
		flexDirection: 'row',
	},

	// status bar [future|present|past]
	statusbar: {
		backgroundColor: theme.color.gray20,
		width: statusbarWidth,
	},
	statusbarIcon: {
		backgroundColor: 'transparent',
		height: theme.fontSize.large,
		left: statusbarWidth,
		position: 'absolute',
		top: theme.fontSize.small,
		width: theme.fontSize.large,
	},
	statusbar__past: {
		backgroundColor: theme.color.green,
	},
	statusbar__present: {
		backgroundColor: theme.color.green,
	},

	// content
	content: {
		alignItems: 'center',
		flexDirection: 'row',
		flexGrow: 1,
		flexShrink: 1,
		padding: theme.fontSize.default,
	},
	text: {
		flexGrow: 1,
		flexShrink: 1,
		paddingRight: theme.fontSize.default,
	},
	text__past: {
		opacity: 0.5,
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

	// right (avatar and chevron)
	right: {
		alignItems: 'center',
		flexDirection: 'row',
		flexShrink: 0,
	},

	// chevron
	chevron: {
		marginLeft: theme.fontSize.default,
	},
});
