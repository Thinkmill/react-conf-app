// @flow
import React from "react";
import { PixelRatio, Text, View } from "react-native";

import theme from "../../theme";

type Props = {
  bordered?: boolean,
  text: string
};

export default function ListTitle({ bordered, text }: Props) {
  const styles = {
    text: {
      color: theme.color.text,
      fontSize: theme.fontSize.xsmall,
      fontWeight: "500",
      lineHeight: theme.fontSize.large
    },
    view: {
      backgroundColor: theme.color.sceneBg,
      borderBottomColor: theme.color.gray20,
      borderBottomWidth: 1 / PixelRatio.get(),
      paddingHorizontal: theme.fontSize.default + 6,
      height: theme.listheader.height,
      justifyContent: "flex-end"
    },
    view__bordered: {
      shadowColor: theme.color.gray20,
      shadowOffset: { height: (-1) / PixelRatio.get(), width: 0 },
      shadowOpacity: 1,
      shadowRadius: 0
    }
  };

  return (
    <View style={[styles.view, bordered && styles.view__bordered]}>
      <Text style={styles.text}>{text.toUpperCase()}</Text>
    </View>
  );
}
