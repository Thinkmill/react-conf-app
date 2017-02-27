import { Dimensions, StyleSheet } from 'react-native';
import theme from '../../../../theme';

export default StyleSheet.create({
	base: {
		alignItems: 'center',
		justifyContent: 'center',
		height: theme.nextup.height,
		paddingHorizontal: 60,
		position: 'absolute',
		left: 0,
		width: Dimensions.get('window').width,
	},
	title: {
		textAlign: 'center',
	},
	subtitle: {
		color: theme.color.gray60,
		textAlign: 'center',
	},
});
