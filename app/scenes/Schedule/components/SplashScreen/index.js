import React, { Component, PropTypes } from 'react';
import {
	Animated,
	Dimensions,
	StyleSheet,
	View,
} from 'react-native';

const windowHeight = Dimensions.get('window').height;
const DURATION = 800;

export default class SplashScreen extends Component {
	constructor (props) {
		super(props);

		this.queueTriangleAnimation = this.queueIdleAnimation.bind(this);

		this.state = {
			height: new Animated.Value(props.animated ? windowHeight + 400 : 500),
			logoOffset: new Animated.Value(props.animated ? 0 : 80),
			logoScale: new Animated.Value(props.animated ? 1 : 0.8),
			leftTriangleSkew: new Animated.Value(5),
			leftTriangleOffset: new Animated.Value(0),
			rightTriangleSkew: new Animated.Value(-3),
			rightTriangleOffset: new Animated.Value(0),
		};
	}
	componentDidMount () {
		if (this.props.animated) {
			const animateTo = (toValue) => {
				return {
					delay: 1000,
					duration: DURATION,
					toValue,
				};
			};

			Animated.parallel([
				Animated.timing(this.state.logoOffset, animateTo(80)),
				Animated.timing(this.state.logoScale, animateTo(0.8)),
				Animated.timing(this.state.height, animateTo(500)),
			]).start(() => {
				if (this.props.onAnimationComplete) {
					this.props.onAnimationComplete();
				}
			});
		} else {
			this.queueIdleAnimation();
		}
	}
	queueIdleAnimation () {
		const { leftTriangleSkew, leftTriangleOffset, rightTriangleSkew, rightTriangleOffset } = this.state;

		const animateTo = (toValue) => {
			return {
				delay: 1500,
				duration: 300,
				toValue,
			};
		};

		const leftSkew = Math.random() * 10 - 5;
		const leftOffset = Math.random() * 20 - 10;
		const rightSkew = Math.random() * 2 + 3;
		const rightOffset = Math.random() * 20 - 10;

		Animated.parallel([
			// -------- Left Triangle --------
			Animated.timing(leftTriangleSkew, animateTo(leftSkew)),
			Animated.timing(leftTriangleOffset, animateTo(leftOffset)),

			// -------- Right Triangle --------
			Animated.timing(rightTriangleSkew, animateTo(rightSkew)),
			Animated.timing(rightTriangleOffset, animateTo(rightOffset)),
		]).start(() => this.queueIdleAnimation());
	}

	render () {
		const { height, logoOffset, logoScale, leftTriangleSkew, leftTriangleOffset, rightTriangleSkew, rightTriangleOffset } = this.state;

		// Map to string values for transform.
		const leftSkew = leftTriangleSkew.interpolate({
			inputRange: [-360, 360],
			outputRange: ['-360deg', '360deg'],
		});
		const rightSkew = rightTriangleSkew.interpolate({
			inputRange: [-360, 360],
			outputRange: ['-360deg', '360deg'],
		});

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
						style={{
							transform: [
								{ translateY: logoOffset },
								{ scale: logoScale },
							],
							zIndex: 2,
						}}
					/>
					<Animated.View
						style={[styles.bottomTriangle, { transform: [
							{ skewY: leftSkew },
							{ translateY: leftTriangleOffset },
						] }]}
					/>
					<Animated.View
						style={[styles.bottomTriangle, { transform: [
							{ skewY: rightSkew },
							{ translateY: rightTriangleOffset },
						] }]}
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
		justifyContent: 'center',
		top: -200,
		left: 0,
		right: 0,
	},

	bottomTriangle: {
		position: 'absolute',
		backgroundColor: 'rgba(36, 31, 32, 0.8)',
		bottom: 40,
		left: -10,
		right: -10,
		height: 1200,
	},
});
