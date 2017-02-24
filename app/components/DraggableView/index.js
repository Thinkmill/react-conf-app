import React, { Component, PropTypes } from 'react';
import { Animated, PanResponder } from 'react-native';

const SWIPE_THRESHOLD = 80;

export default class DraggableView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			pan: new Animated.ValueXY(), // inits to zero
		};

		this.state.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: Animated.event([null, {
				dx: props.allowX ? this.state.pan.x : 0, // x,y are Animated.Value
				dy: props.allowY ? this.state.pan.y : 0,
			}]),
			onPanResponderRelease: (e, {vx, vy}) => {
				this.state.pan.flattenOffset();

				if (Math.abs(this.state.pan.y._value) > SWIPE_THRESHOLD) {
					this.props.onRelease();
					Animated.decay(this.state.pan, {
						velocity: { x: vx, y: vy },
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
	allowX: PropTypes.bool,
	allowY: PropTypes.bool,
	onRelease: PropTypes.func,
};
DraggableView.defaultProps = {
	allowX: true,
	allowY: true,
	style: {},
};
