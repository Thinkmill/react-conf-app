import React, { Component, PropTypes } from 'react';
import { Animated, PanResponder } from 'react-native';
import clamp from 'clamp';

const SWIPE_THRESHOLD = 100;

export default class DraggableView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			pan: new Animated.ValueXY(), // inits to zero
		};

		this.state.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: Animated.event([null, {
				dx: this.state.pan.x, // x,y are Animated.Value
				dy: this.state.pan.y,
			}]),
			onPanResponderRelease: (e, {vx, vy}) => {
				this.state.pan.flattenOffset();
				var velocity;

				if (vx >= 0) {
					velocity = clamp(vx, 3, 5);
				} else if (vx < 0) {
					velocity = clamp(vx * -1, 3, 5) * -1;
				}

				if (Math.abs(this.state.pan.y._value) > SWIPE_THRESHOLD) {
					this.props.onRelease();
					Animated.decay(this.state.pan, {
						velocity: { x: velocity, y: vy },
						deceleration: 0.98
					}).start();
				} else {
					Animated.spring(this.state.pan, {
						toValue: { x: 0, y: 0 },
						friction: 8,
						tension: 80,
					}).start()
				}
			},
		});
	}
	render() {
		return (
			<Animated.View
				{...this.state.panResponder.panHandlers}
				style={[this.props.style, this.state.pan.getLayout()]}>
				{this.props.children}
			</Animated.View>
		);
	}
};

DraggableView.propTypes = {
	onRelease: PropTypes.func,
};
DraggableView.defaultProps = {
	style: {},
};
