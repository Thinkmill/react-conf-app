import React, { Component, PropTypes } from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';

import theme from '../../../../theme';
import { darken } from '../../../../utils/color';

export default class NowButton extends Component {
	render () {
		const { onPress } = this.props;
		const touchableProps = {
			activeOpacity: 1,
			onPress,
			style: styles.button,
			underlayColor: darken(theme.color.green, 10),
		};

		return (
			<View style={styles.layout}>
				<TouchableHighlight {...touchableProps}>
					<Text style={styles.text}>NOW</Text>
				</TouchableHighlight>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	layout: {
		alignItems: 'center',
		bottom: 0,
		left: 0,
		paddingBottom: 10,
		position: 'absolute',
		right: 0,
	},
	button: {
		justifyContent: 'center',
		backgroundColor: theme.color.green,
		borderRadius: 34,
		height: 34,
		paddingHorizontal: 24,
		shadowColor: 'black',
		shadowOffset: { height: 1, width: 0 },
		shadowOpacity: 0.25,
		shadowRadius: 2,
	},
	text: {
		color: 'white',
		fontWeight: 'bold',
	},
});
