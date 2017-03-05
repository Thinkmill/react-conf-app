// @flow
import React, { Component } from 'react';
import { Animated, PanResponder } from 'react-native';

const SWIPE_THRESHOLD = 80;

export default class DraggableView extends Component {
	props: {
		allowX: boolean,
		allowY: boolean,
		onMove?: () => mixed,
		onRelease: () => mixed,
		children?: Array<React.Element<mixed>>,
	};

	state = {
		pan: new Animated.ValueXY(), // inits to zero
	};

	static defaultProps = {
		allowX: true,
		allowY: true,
		style: {},
	};

	_panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onPanResponderMove: (e, gestureState) => {
			if (this.props.onMove) this.props.onMove(e, gestureState);

			Animated.event([null, {
				dx: this.props.allowX ? this.state.pan.x : 0, // x,y are Animated.Value
				dy: this.props.allowY ? this.state.pan.y : 0,
			}])(e, gestureState);
		},
		onPanResponderRelease: (e, { vx, vy }) => {
			this.state.pan.flattenOffset();


			if (Math.abs(this.state.pan.y._value) > SWIPE_THRESHOLD) {
				if (this.props.onRelease) this.props.onRelease(e, { vx, vy });
				Animated.decay(this.state.pan, {
					velocity: {
						x: this.props.allowX ? vx : 0,
						y: this.props.allowY ? vy : 0,
					},
					deceleration: 0.98,
				}).start();
			} else {
				Animated.spring(this.state.pan, {
					toValue: { x: 0, y: 0 },
					friction: 8,
					tension: 80,
				}).start();
			}
		},
	});

	render () {
		return (
			<Animated.View
				{...this._panResponder.panHandlers}
				style={[this.props.style, this.state.pan.getLayout()]}>
				{this.props.children}
			</Animated.View>
		);
	}
};
