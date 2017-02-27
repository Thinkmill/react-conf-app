import React, { Component, PropTypes } from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import theme from '../../../../theme';
import styles from './styles';

const ICON_VARIANT = {
	bottom: 'ios-arrow-up',
	top: 'ios-arrow-down',
};

export default class NextUp extends Component {
	render () {
		const {
			position,
			speakerName,
			talkStartTime,
			talkTitle,
		} = this.props;

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
			<View style={[styles.base, baseStyles]}>
				{position === 'bottom' && icon}
				<Text style={styles.title} numberOfLines={1}>
					{talkTitle}
				</Text>
				<Text style={styles.subtitle}>
					{talkStartTime} &mdash; {speakerName}
				</Text>
				{position === 'top' && icon}
			</View>
		);
	}
};

NextUp.propTypes = {
	position: PropTypes.oneOf(['bottom', 'top']),
	speakerName: PropTypes.string.isRequired,
	talkStartTime: PropTypes.string.isRequired,
	talkTitle: PropTypes.string.isRequired,
};
