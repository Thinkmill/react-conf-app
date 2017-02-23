import React, { Component, PropTypes } from 'react';
import { Animated, Easing, Image, PixelRatio, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Avatar from '../../../../components/Avatar';
import theme from '../../../../theme';
import { darken, fade, lighten } from '../../../../utils/color';

const animationDefault = (val) => ({
	toValue: val,
	duration: 666,
	easing: Easing.inOut(Easing.quad),
});

export default class Talk extends Component {
	constructor (props) {
		super(props);

		this.animValue = new Animated.Value(0);
	}
	componentDidMount () {
		this.cycleAnimation();
	}
	cycleAnimation () {
		Animated.sequence([
			Animated.timing(this.animValue, animationDefault(1)),
			Animated.timing(this.animValue, animationDefault(0))
		]).start(() => this.cycleAnimation())
	}
	render () {
		const {
			endTime,
			onPress,
			speakerAvatarUri,
			speakerName,
			startTime,
			status,
			title,
			...props
		} = this.props;

		const isPast = status === 'past';
		const isPresent = status === 'present';

		const touchableProps = {
			activeOpacity: 1,
			onPress: onPress,
			style: [styles.touchable, styles['touchable__' + status]],
			underlayColor: theme.color.gray05,
		};
		const animatedStyle = {
			transform: [{
				translateX: this.animValue.interpolate({
					inputRange: [0, 1],
					outputRange: [0, 4],
				}),
			}],
		};

		return (
			<TouchableHighlight {...touchableProps} {...props}>
				<View style={[styles.base, styles['base__' + status]]}>
					<View style={[styles.statusbar, styles['statusbar__' + status]]}>
						{isPresent && (
							<Animated.View style={animatedStyle}>
								<Icon
									color={theme.color.green}
									name="md-arrow-dropright"
									size={34}
									style={styles.statusbarIcon}
								/>
							</Animated.View>
						)}
					</View>

					<View style={styles.content}>
						<View style={[styles.text, styles['text__' + status]]}>
							<Text style={[styles.subtitle, styles['subtitle__' + status]]}>
								{startTime} &mdash; {speakerName}
							</Text>
							<Text style={[styles.title, styles['title__' + status]]}>
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
	}
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

const statusbarWidth = 4;
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
	// base__present: {
	// 	backgroundColor: fade(theme.color.green, 4),
	// },

	// status bar [future|present|past]
	statusbar: {
		backgroundColor: theme.color.gray20,
		width: statusbarWidth,
	},
	statusbarIcon: {
		backgroundColor: 'transparent',
		height: 34,
		left: 0,
		position: 'absolute',
		top: 10,
		width: 34,
	},
	statusbar__past: {
		backgroundColor: lighten(theme.color.green, 40),
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
	subtitle__present: {
		color: theme.color.text,
	},
	title: {
		color: theme.color.text,
		fontSize: theme.fontSize.default,
	},
	title__present: {
		fontWeight: '500',
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
