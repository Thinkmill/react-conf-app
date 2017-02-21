import React, { cloneElement, Component, PropTypes } from 'react';
import { Animated, Dimensions, Modal as RNModal, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'react-native-blur';

import theme from '../../theme';

function animateToValueWithOptions (val) {
	return {
		toValue: val,
		friction: 10,
		tension: 120,
	};
};

export default class Modal extends Component {
	constructor () {
		super();

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
			alignment,
			blurAmount,
			blurType,
		} = this.props;
		const blockoutDynamicStyles = {
			justifyContent: alignment === 'top' ? 'flex-start' : 'center',
			opacity: this.state.animValue,
		};
		const dialogDynamicStyles = {
			transform: [{
				scale: this.state.animValue.interpolate({
					inputRange: [0, 1],
					outputRange: [0.9, 1],
				}),
			}],
		};

		return (
			<RNModal animationType="none" transparent visible>
				<Animated.View style={[styles.blockout, blockoutDynamicStyles]}>
					<BlurView blurAmount={blurAmount} blurType={blurType} style={styles.blur}>
						<TouchableOpacity onPress={this.onClose} style={styles.touchable} />
					</BlurView>
					<Animated.View style={[styles.dialog, dialogDynamicStyles]}>
						{this.renderChildren()}
					</Animated.View>
				</Animated.View>
			</RNModal>
		);
	}
};

Modal.propTypes = {
	alignment: PropTypes.oneOf(['center', 'top']),
	blurAmount: PropTypes.number,
	blurType: PropTypes.oneOf(['dark', 'light', 'xlight']),
	children: PropTypes.element.isRequired,
	onClose: PropTypes.func.isRequired,
};
Modal.defaultProps = {
	alignment: 'center',
	blurAmount: 23,
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
	dialog: {
		marginVertical: theme.fontSize.large,
	},
});
