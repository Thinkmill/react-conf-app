// @flow
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import theme from '../../../../theme';
import { TalkStatusBar } from '../Talk';

const gradientSteps = 14;
const gradientJump = 1.04;

export default class Break extends Component {
  props: {
    endTime?: string,
    lightning?: boolean,
    startTime?: string,
    status: 'future' | 'past' | 'present',
    title: string,
  };

  render() {
    const { lightning, startTime, status, ...props } = this.props;
    const title = this.props.title || 'Break';
    const contentProps = lightning || Platform.OS === 'android'
      ? { style: styles.gradient }
      : {
          start: { x: 0.0, y: 0.15 },
          end: { x: 1.0, y: 0.3 },
          locations: generateGradientLocations(gradientSteps),
          colors: generateGradientColors(gradientSteps),
          style: styles.gradient,
        };

    const Content = lightning || Platform.OS === 'android'
      ? View
      : LinearGradient;

    return (
      <View style={[styles.base, styles['base__' + status]]} {...props}>
        <TalkStatusBar status={status} />
        <Content {...contentProps}>
          <Text style={[styles.text, styles['text__' + status]]}>
            {startTime} -
            <Text style={styles.title}> {title}</Text>
          </Text>
        </Content>
      </View>
    );
  }
}

function generateGradientLocations(steps) {
  let locations = [];

  const smallWidth = 0.005;

  for (let i = 0; i < steps; i++) {
    const start = gradientJump / steps * i;
    const end = gradientJump / steps * (i + 1);

    locations.push(start); // big start
    locations.push(end - smallWidth); // big end
    locations.push(end - smallWidth); // small start
    locations.push(end); // small end
  }

  return locations;
}
function generateGradientColors(steps) {
  const { gray10 } = theme.color;
  let colors = [];

  for (let i = 0; i < steps; i++) {
    colors.push('#fcfcfc');
    colors.push('#fcfcfc');
    colors.push(gray10);
    colors.push(gray10);
  }

  return colors;
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'stretch',
    backgroundColor: '#fcfcfc',
    flexDirection: 'row',
  },
  gradient: {
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
    flexGrow: 1,
    height: 44,
    left: theme.fontSize.default,
    justifyContent: 'center',
  },
  text: {
    backgroundColor: 'transparent',
    color: theme.color.text,
    fontSize: theme.fontSize.small,
    fontWeight: '300',
    left: -theme.fontSize.default,
  },
  text__past: {
    color: theme.color.gray40,
  },
  title: {
    fontWeight: '500',
  },
});
