import React, { Component, PropTypes } from 'react';
import {
	Text,
	TouchableHighlight,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import theme from '../../../../theme';

import styles from './styles';

export default function NextUp ({
	speakerName,
	talkStartTime,
	talkTitle,
	...props
}) {
	const touchableProps = {
		activeOpacity: 1,
		style: styles.touchable,
		underlayColor: 'rgba(0,0,0,0.1)',
	};

	return (
		<TouchableHighlight {...touchableProps} {...props}>
			<LinearGradient colors={['rgba(244,244,244, 0.25)', theme.color.sceneBg]} locations={[0,0.3]} style={styles.base}>
				<Icon
					color={theme.color.text}
					name="ios-arrow-down"
					size={20}
					style={styles.icon}
				/>
				<Text style={styles.title} numberOfLines={1}>
					{talkTitle}
				</Text>
				<Text style={styles.subtitle}>
					{talkStartTime} &mdash; {speakerName}
				</Text>
			</LinearGradient>
		</TouchableHighlight>
	);
};

NextUp.propTypes = {
	onPress: PropTypes.func.isRequired,
	speakerName: PropTypes.string.isRequired,
	talkStartTime: PropTypes.string.isRequired,
	talkTitle: PropTypes.string.isRequired,
};
