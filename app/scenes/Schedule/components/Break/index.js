// @flow
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '../../../../theme';
import { TalkStatusBar } from '../Talk';

import { Components } from 'exponent';
const { LinearGradient } = Components;

const gradientSteps = 14;
const gradientJump = 1.05;

export default class Break extends Component {
  props: {
    endTime?: string,
    important: boolean,
    startTime?: string,
    status: 'future' | 'past' | 'present',
    title: string,
  };

  render() {
    const { important, startTime, status, ...props } = this.props;
    const title = this.props.title || 'Break';

    return (
      <View style={[styles.base, styles['base__' + status]]} {...props}>
        <TalkStatusBar status={status} />
        {important
          ? <View style={styles.gradient}>
              <Text style={[styles.text, styles['text__' + status]]}>
                {startTime} —
                <Text style={[styles.importantText, styles['text__' + status]]}>
                  {' '}{title}
                </Text>
              </Text>
            </View>
          : <LinearGradient
              start={[0.0, 0.0]}
              end={[1.0, 0.125]}
              locations={generateGradientLocations(gradientSteps)}
              colors={generateGradientColors(gradientSteps)}
              style={styles.gradient}
            >
              <Text style={[styles.text, styles['text__' + status]]}>
                {startTime} — {title}
              </Text>
            </LinearGradient>}
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
    colors.push('white');
    colors.push('white');
    colors.push(gray10);
    colors.push(gray10);
  }

  return colors;
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'stretch',
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  gradient: {
    alignItems: 'center',
    backgroundColor: 'white',
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
  importantText: {
    color: theme.color.blue,
  },
});
