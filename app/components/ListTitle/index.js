// @flow
import React from 'react';
import { PixelRatio, Text, View, StyleSheet } from 'react-native';

import theme from '../../theme';

type Props = {
	bordered?: boolean,
	text: string,
};

export default function ListTitle ({ bordered, text }: Props) {
	return (
		<View style={[styles.view, bordered && styles.view__bordered]}>
			<Text style={styles.text}>{text.toUpperCase()}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
  text: {
    color: theme.color.text,
    fontSize: theme.fontSize.xsmall,
    fontWeight: '500',
    lineHeight: theme.fontSize.large,
  },
  view: {
    backgroundColor: theme.color.sceneBg,
    borderBottomColor: theme.color.gray20,
    borderBottomWidth: 1 / PixelRatio.get(),
    paddingHorizontal: theme.fontSize.default + 6,
    height: theme.listheader.height,
    justifyContent: 'flex-end',
  },
  view__bordered: {
    borderTopColor: theme.color.gray20,
    borderTopWidth: 1 / PixelRatio.get(),
  },
});
