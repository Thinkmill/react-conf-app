// @flow
import React from 'react';
import {
	PixelRatio,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native';

import Avatar from '../../../../components/Avatar';
import theme from '../../../../theme';

type Props = {
	avatar: string,
	name: string,
	onPress: () => mixed,
	summary: string,
};

export default function Organiser ({
	avatar,
	name,
	onPress,
	summary,
}: Props) {
	const touchableProps = {
		activeOpacity: 1,
		onPress: onPress,
		style: styles.touchable,
		underlayColor: theme.color.gray05,
	};

	return (
		<TouchableHighlight {...touchableProps}>
			<View style={styles.base}>
				<Avatar source={avatar} />
				<View style={styles.text}>
					<Text style={styles.title}>{name}</Text>
					<Text style={styles.subtitle}>{summary}</Text>
				</View>
			</View>
		</TouchableHighlight>
	);
};

const styles = StyleSheet.create({
	touchable: {
		backgroundColor: 'white',
	},
	base: {
		alignItems: 'center',
		borderBottomColor: theme.color.gray20,
		borderBottomWidth: 1 / PixelRatio.get(),
		flexDirection: 'row',
		flexGrow: 1,
		flexShrink: 1,
		padding: theme.fontSize.default,
	},

	// content
	text: {
		flexGrow: 1,
		flexShrink: 1,
		paddingLeft: theme.fontSize.default,
	},
	subtitle: {
		color: theme.color.gray60,
		fontSize: theme.fontSize.small,
		fontWeight: '300',
		marginBottom: theme.fontSize.small,
	},
	title: {
		color: theme.color.text,
		fontSize: theme.fontSize.default,
	},
});
