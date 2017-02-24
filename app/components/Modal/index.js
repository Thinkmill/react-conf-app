import React, { cloneElement, Component, PropTypes } from 'react';
import { Animated, Dimensions, Modal as RNModal, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'react-native-blur';

import theme from '../../theme';

function animateToValueWithOptions (val) {
	return {
		toValue: val,
		friction: 10,
		tension: 100,
	};
};

const MODAL_ALIGNMENT = {
	bottom: 'flex-end',
	top: 'flex-start',
	center: 'center',
};

export default class Modal extends Component {
	constructor (props) {
		super(props);

		this.onClose = this.onClose.bind(this);

		this.state = {
			animValue: new Animated.Value(0),
		};
	}
	componentDidMount () {
		Animated.spring(this.state.animValue, animateToValueWithOptions(1)).start();
	}
	onClose () {
		const { animValue } = this.state;
		const { onClose } = this.props;

		if (this.__isClosed) return;

		this.__isClosed = true;

		Animated.spring(animValue, animateToValueWithOptions(0)).start(onClose);
	}
	renderChildren () {
		return cloneElement(this.props.children, {
			onClose: this.onClose,
		});
	}
	render () {
		const {
			align,
			blurAmount,
			blurType,
			style,
		} = this.props;

		const blockoutDynamicStyles = {
			justifyContent: MODAL_ALIGNMENT[align],
			opacity: this.state.animValue,
		};
		const dialogDynamicStyles = {
			transform: [{
				scale: this.state.animValue.interpolate({
					inputRange: [0, 1],
					outputRange: [0.93, 1],
				})}, {
				translateY: this.state.animValue.interpolate({
					inputRange: [0, 1],
					outputRange: [100, 1],
				})}
			],
		};

		return (
			<RNModal animationType="none" transparent visible>
				<Animated.View style={[styles.blockout, blockoutDynamicStyles]}>
					<BlurView blurAmount={blurAmount} blurType={blurType} style={styles.blur}>
						<TouchableOpacity onPress={this.onClose} style={styles.touchable} />
					</BlurView>
					<Animated.View style={[style, dialogDynamicStyles]}>
						{this.props.children}
					</Animated.View>
				</Animated.View>
			</RNModal>
		);
	}
};

Modal.propTypes = {
	align: PropTypes.oneOf(['bottom', 'center', 'top']),
	blurAmount: PropTypes.number,
	blurType: PropTypes.oneOf(['dark', 'light', 'xlight']),
	onClose: PropTypes.func.isRequired,
};
Modal.defaultProps = {
	align: 'center',
	blurAmount: 12,
	blurType: 'dark',
};

const fillSpace = {
	height: Dimensions.get('window').height,
	left: 0,
	position: 'absolute',
	top: 0,
	width: Dimensions.get('window').width,
};
const styles = StyleSheet.create({
	blockout: {
		alignItems: 'center',
		...fillSpace,
	},
	blur: fillSpace,
	touchable: {
		flex: 1,
	},
});
