// @flow
import React, { Component } from 'react';
import { PixelRatio, Platform, StyleSheet, Text, View } from 'react-native';

import theme from '../../../../theme';
import { TalkStatusBar } from '../Talk';

export default class Break extends Component {
  props: {
    endTime?: string,
    lightning?: boolean,
    startTime?: string,
    status: 'future' | 'past' | 'present',
    title: string,
  };

  static defaultProps = {
    title: 'Break',
  };

  render() {
    const { lightning, startTime, status, title, ...props } = this.props;

    return (
      <View style={[styles.base, styles['base__' + status]]} {...props}>
        <TalkStatusBar status={status} />
        <View style={[styles.content, lightning && styles.content__lightning]}>
          <Text style={[styles.text, styles['text__' + status]]}>
            {startTime} -
            <Text style={styles.title}> {title}</Text>
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'stretch',
    backgroundColor: '#fafafa',
    borderBottomColor: theme.color.gray20,
    borderBottomWidth: 1 / PixelRatio.get(),
    flexDirection: 'row',
  },
  content: {
    alignItems: 'center',
    backgroundColor: '#fafafa',
    flexGrow: 1,
    height: 44,
    justifyContent: 'center',
  },
  content__lightning: {
    height: 32,
  },
  text: {
    backgroundColor: 'transparent',
    color: theme.color.text,
    fontSize: theme.fontSize.small,
    fontWeight: '300',
  },
  text__past: {
    color: theme.color.gray40,
  },
  title: {
    fontWeight: '500',
  },
});
