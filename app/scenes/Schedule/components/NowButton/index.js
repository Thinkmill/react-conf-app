import React, { Component, PropTypes } from 'react';
import { Animated, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
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
		const { blue } = theme.color;

		const gradientColors = [lighten(blue, 6), darken(blue, 6)];
		const touchableProps = {
			hitSlop: {
				bottom: 20,
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
			<Animated.View style={[styles.layout, dynamicStyles]} pointerEvents="box-none">
				<TouchableWithoutFeedback {...touchableProps}>
					<LinearGradient colors={gradientColors} style={styles.button}>
						<Text style={styles.text}>NOW</Text>
					</LinearGradient>
				</TouchableWithoutFeedback>
			</Animated.View>
		);
	}
};

NowButton.propTypes = {
	onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
	layout: {
		alignItems: 'center',
		bottom: 0,
		left: 0,
		paddingBottom: 20,
		position: 'absolute',
		right: 0,
	},
	button: {
		backgroundColor: theme.color.blue,
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
		backgroundColor: 'transparent',
		color: 'white',
		fontWeight: 'bold',
	},
});
