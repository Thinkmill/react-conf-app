import React, { Component, PropTypes } from 'react';
import { Animated, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import theme from '../../../../theme';

import styles from './styles';

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
		const { talkTitle } = this.props;
		const { animValue } = this.state;

		const dynamicStyles = {
			transform: [{
				scale: animValue.interpolate({
					inputRange: [0, 1],
					outputRange: [1, 1.2],
				}),
			}],
		};

		return (
			<Animated.View style={[styles.base, styles.touchable, dynamicStyles]}>
				<Icon
					color={theme.color.text}
					name="ios-arrow-up"
					size={20}
					style={styles.icon}
				/>
				<Text style={styles.title} numberOfLines={1}>
					{talkTitle}
				</Text>
				<Text style={styles.subtitle}>
					Release to Load
				</Text>
			</Animated.View>
		);
	}
};

NextupInstructions.propTypes = {
	talkTitle: PropTypes.string.isRequired,
};
