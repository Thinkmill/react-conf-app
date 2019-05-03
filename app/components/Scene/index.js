//
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function Scene({ scroll, style, ...props }) {
  const styles = [{ flex: 1 }, style];
  const Tag = scroll ? ScrollView : View;

  return <Tag style={styles} {...props} />;
}
