import React, { PropTypes } from 'react';
import { PixelRatio, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import theme from '../../theme';

export default function Navbar ({
	backgroundColor,
	leftButtonDisabled,
	leftButtonIconName,
	leftButtonOnPress,
	leftButtonText,
	rightButtonDisabled,
	rightButtonIconName,
	rightButtonOnPress,
	rightButtonText,
	textColor,
	title,
	titleRenderer,
}) {
	return (
		<View style={[styles.container, { backgroundColor: backgroundColor }]}>
			{/* Left Button */}
			{leftButtonOnPress ? (
				<TouchableOpacity disabled={leftButtonDisabled} onPress={leftButtonOnPress} style={[styles.button, styles.leftButton]}>
					{!!leftButtonIconName && (
						<Icon
							color={theme.color.text}
							name={leftButtonIconName}
							size={36}
							style={{ marginRight: 10, height: 36 }}
						/>
					)}
					<Text style={[styles.buttonText, { opacity: leftButtonDisabled ? 0.6 : 1 }]}>
						{leftButtonText}
					</Text>
				</TouchableOpacity>
			) : (
				<View style={styles.button} />
			)}

			{/* Title */}
			{titleRenderer ? titleRenderer() : (
				<View style={styles.title}>
					<Text style={[styles.titleText, { color: textColor }]}>{title}</Text>
				</View>
			)}

			{/* Right Button */}
			{rightButtonOnPress ? (
				<TouchableOpacity disabled={rightButtonDisabled} onPress={rightButtonOnPress} style={[styles.button, styles.button__right]}>
					{!!rightButtonIconName && (
						<Icon
							color={theme.color.text}
							name={rightButtonIconName}
							size={36}
							style={{ marginLeft: 10, height: 36 }}
						/>
					)}
					<Text style={[styles.buttonText, { opacity: rightButtonDisabled ? 0.6 : 1 }]}>
						{rightButtonText}
					</Text>
				</TouchableOpacity>
			) : (
				<View style={styles.button} />
			)}
		</View>
	);
};

Navbar.propTypes = {
	backgroundColor: PropTypes.string,
	leftButtonDisabled: PropTypes.bool,
	leftButtonIconName: PropTypes.string,
	leftButtonOnPress: PropTypes.func,
	leftButtonText: PropTypes.string,
	rightButtonDisabled: PropTypes.bool,
	rightButtonIconName: PropTypes.string,
	rightButtonOnPress: PropTypes.func,
	rightButtonText: PropTypes.string,
	textColor: PropTypes.string,
	title: PropTypes.string,
	titleRenderer: PropTypes.func,
};
Navbar.defaultProps = {
	backgroundColor: theme.header.backgroundColor,
	buttonColor: theme.header.button,
	textColor: theme.header.textColor,
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'stretch',
		borderBottomColor: 'rgba(0, 0, 0, 0.1)',
		borderBottomWidth: 1 / PixelRatio.get(),
		flexDirection: 'row',
		height: 64,
		overflow: 'hidden',
		justifyContent: 'space-between',
		paddingTop: 20, // account for the statusbar
	},

	// buttons
	button: {
		alignItems: 'center',
		flex: 2,
		flexDirection: 'row',
		paddingHorizontal: theme.fontSize.default,
	},
	button__right: {
		justifyContent: 'flex-end',
	},
	buttonText: {
		color: theme.color.blue,
		fontSize: theme.fontSize.default,
	},

	// title
	title: {
		alignItems: 'center',
		flex: 4,
		justifyContent: 'center',
	},
	titleText: {
		color: theme.color.text,
		fontSize: theme.fontSize.default,
		fontWeight: '500',
	},
});
