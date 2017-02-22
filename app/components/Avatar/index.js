import React, { PropTypes } from 'react';
import { Image, View } from 'react-native';

import theme from '../../theme';

export default function Avatar ({ size, source }) {
	const styles = {
		wrapper: {
			backgroundColor: theme.color.sceneBg,
			borderRadius: size,
			overflow: 'hidden',
			height: size,
			width: size,
		},
		image: {
			height: size,
			width: size,
		},
	};

	return (
		<View style={styles.wrapper}>
			<Image
				source={{ uri: source }}
				style={styles.image}
			/>
		</View>
	);
};

Avatar.propTypes = {
	size: PropTypes.number,
	source: PropTypes.string,
};
Avatar.defaultProps = {
	size: 44,
};
