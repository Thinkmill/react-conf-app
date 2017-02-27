import React, { Component, PropTypes } from 'react';
import { Animated, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import theme from '../../../../theme';
import styles from './styles';

const ICON_VARIANT = {
	bottom: 'ios-arrow-down',
	top: 'ios-arrow-up',
};

const animateToValue = (val) => ({
	toValue: val,
	duration: 150,
});

export default class NextupInstructions extends Component {
	constructor (props) {
		super(props);

		this.state = {
			animValue: new Animated.Value(0),
		};
	}
	componentDidMount () {
		const { animValue } = this.state;

		Animated.timing(animValue, animateToValue(1)).start(() => {
			Animated.timing(animValue, animateToValue(0)).start();
		});
	}
	render () {
		const { position, talkTitle } = this.props;
		const { animValue } = this.state;

		const dynamicStyles = {
			[position]: -theme.nextup.height,
			transform: [{
				scale: animValue.interpolate({
					inputRange: [0, 1],
					outputRange: [1, 1.13],
				}),
			}],
		};

		let baseStyles;

		if (position === 'bottom') {
			baseStyles = {
				bottom: -theme.nextup.height,
			};
		} else {
			baseStyles = {
				top: -theme.nextup.height,
			};
		}

		const icon = (
			<Icon
				color={theme.color.text}
				name={ICON_VARIANT[position]}
				size={20}
			/>
		);

		return (
			<Animated.View style={[styles.base, baseStyles, dynamicStyles]}>
				{position === 'bottom' && icon}
				<Text style={styles.title} numberOfLines={1}>
					{talkTitle}
				</Text>
				<Text style={styles.subtitle}>
					Release to Load
				</Text>
				{position === 'top' && icon}
			</Animated.View>
		);
	}
};

NextupInstructions.propTypes = {
	position: PropTypes.oneOf(['bottom', 'top']),
	talkTitle: PropTypes.string.isRequired,
};
