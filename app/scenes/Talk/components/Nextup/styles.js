import { StyleSheet } from 'react-native';
import theme from '../../../../theme';

export default StyleSheet.create({
	touchable: {
		backgroundColor: 'transparent',
		position: 'absolute',
		bottom: 0,
		right: 0,
		left: 0,
	},
	base: {
		alignItems: 'center',
		height: 80,
		justifyContent: 'center',
		paddingHorizontal: theme.fontSize.xlarge,
	},
	title: {
		textAlign: 'center',
	},
	subtitle: {
		color: theme.color.gray60,
		textAlign: 'center',
	},
});
