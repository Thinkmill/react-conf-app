import React, { Component, PropTypes } from 'react';
import { Animated, StyleSheet, TouchableWithoutFeedback, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import theme from '../../../../theme';
import { lighten, darken } from '../../../../utils/color';

export default class NowButton extends Component {
	constructor (props) {
		super(props);

		this.state = { animValue: new Animated.Value(0) };
	}
	springToValue (val) {
		Animated.spring(this.state.animValue, {
			toValue: val,
			friction: 3,
			tension: 50,
		}).start();
	}
	render () {
		const { onPress } = this.props;
		const { animValue } = this.state;
		const { green } = theme.color;

		const gradientColors = [lighten(green, 6), darken(green, 6)];
		const touchableProps = {
			hitSlop: {
				bottom: theme.fontSize.large,
				left: 10,
				right: 10,
				top: 10,
			},
			onPress,
			onPressIn: () => this.springToValue(1),
			onPressOut: () => this.springToValue(0),
		};
		const dynamicStyles = {
			transform: [{
				scale: animValue.interpolate({
					inputRange: [0, 1],
					outputRange: [1, 0.9],
				}),
			}],
		};

		return (
			<Animated.View style={[styles.layout, dynamicStyles]}>
				<TouchableWithoutFeedback {...touchableProps}>
					<LinearGradient colors={gradientColors} style={styles.button}>
						<Icon
							color="white"
							name="ios-timer"
							size={32}
							style={{ backgroundColor: 'transparent', height: 32 }}
						/>
					</LinearGradient>
				</TouchableWithoutFeedback>
			</Animated.View>
		);
	}
};

const styles = StyleSheet.create({
	layout: {
		alignItems: 'center',
		bottom: 0,
		left: 0,
		paddingBottom: theme.fontSize.large,
		position: 'absolute',
		right: 0,
	},
	button: {
		backgroundColor: theme.color.green,
		borderRadius: 40,
		height: 40,
		justifyContent: 'center',
		paddingHorizontal: 32,
		shadowColor: 'black',
		shadowOffset: { height: 1, width: 0 },
		shadowOpacity: 0.24,
		shadowRadius: 2,
	},
	text: {
		color: 'white',
		fontWeight: 'bold',
	},
});
