// @flow
import React from 'react';
import { Image, View } from 'react-native';

import theme from '../../theme';

type Props = {
  size?: number,
  source: string,
};

export default function Avatar({ size = 44, source }: Props) {
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
      <Image source={{ uri: source }} style={styles.image} />
    </View>
  );
}
