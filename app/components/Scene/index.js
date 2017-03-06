// @flow
import React from "react";
import { ScrollView, View } from "react-native";

type Props = {
  scroll?: boolean,
  style?: Object
};

export default function Scene({ scroll, style, ...props }: Props) {
  const styles = [{ flex: 1 }, style];
  const Tag = scroll ? ScrollView : View;

  return <Tag style={styles} {...props} />;
}
