//
import React from 'react';
import { Image, Platform, View } from 'react-native';

import theme from '../../theme';

export default function Avatar({ size = 44, source, style, ...props }) {
  const styles = {
    wrapper: {
      backgroundColor: theme.color.sceneBg,
      borderRadius: size,
      overflow: 'hidden',
      height: size,
      width: size
    },
    image: {
      borderRadius: Platform.OS === 'android' ? size : 0,
      height: size,
      width: size
    }
  };

  return (
    <View style={[styles.wrapper, style]} {...props}>
      {source ? <Image source={{ uri: source }} style={styles.image} /> : null}
    </View>
  );
}
