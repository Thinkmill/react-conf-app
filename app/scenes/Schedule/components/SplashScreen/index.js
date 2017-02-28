import React, { Component, PropTypes } from 'react';
import {
	Animated,
	Dimensions,
	Image,
	StyleSheet,
	View,
} from 'react-native';

const windowHeight = Dimensions.get('window').height;
const DURATION = 800;

export default class SplashScreen extends Component {
	constructor (props) {
		super(props);

		this.state = {
			height: new Animated.Value(props.animated ? windowHeight + 400 : 500),
			logoOffset: new Animated.Value(props.animated ? 0 : 80),
			logoScale: new Animated.Value(props.animated ? 1 : 0.8),
		};
	}
	componentDidMount () {
		if (this.props.animated) {
			Animated.timing(this.state.height, {
				toValue: 500,
				duration: DURATION,
			}).start(() => {
				if (this.props.onAnimationComplete) {
					this.props.onAnimationComplete();
				}
			});

			Animated.timing(this.state.logoOffset, {
				toValue: 80,
				duration: DURATION,
			}).start();

			Animated.timing(this.state.logoScale, {
				toValue: 0.8,
				duration: DURATION,
			}).start();
		}
	}
	render () {
		const { height, logoOffset, logoScale } = this.state;

		return (
			<View style={styles.wrapper}>
				{/* I'm a spacer to push other content below me down */}
				<View style={{ height: 300 }} />

				{/* The actual splash screen */}
				<Animated.View
					pointerEvents="none"
					style={[styles.splash, { height }]}
				>
					<Animated.Image
						source={require('../../images/splash-logo.png')}
						style={{ transform: [
							{ translateY: logoOffset },
							{ scale: logoScale },
						] }}
					/>
					<Image
						source={require('../../images/splash-bottom.png')}
						resizeMode="stretch"
						style={styles.bottomImage}
					/>
				</Animated.View>
			</View>
		);
	}
};

SplashScreen.PropTypes = {
	animated: PropTypes.bool,
	onAnimationComplete: PropTypes.func,
};

const styles = StyleSheet.create({
	wrapper: {
		zIndex: 2,
	},

	splash: {
		position: 'absolute',
		alignItems: 'center',
		backgroundColor: 'rgba(48, 44, 45, 1)',
		justifyContent: 'center',
		top: -200,
		left: 0,
		right: 0,
	},

	bottomImage: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		height: 63,
		right: 0,
	},
});
