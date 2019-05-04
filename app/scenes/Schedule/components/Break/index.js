import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PixelRatio, Platform, StyleSheet, Text, View } from 'react-native';

import theme from '../../../../theme';
import { TalkStatusBar } from '../Talk';

export default class Break extends PureComponent {
  static propTypes = {
    startTime: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['future', 'past', 'present']),
    title: PropTypes.string.isRequired
  };

  static defaultProps = {
    title: 'Break'
  };

  render() {
    const { startTime, status, title } = this.props;

    return (
      <View style={styles['break']}>
        <TalkStatusBar status={status} />
        <View style={styles['break__content']}>
          <Text
            style={[styles['break__text'], styles['break__text--' + status]]}
          >
            {startTime} -
            <Text style={styles['break__title']}> {title}</Text>
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  break: {
    alignItems: 'stretch',
    backgroundColor: '#fbfbfb',
    borderBottomColor: theme.color.gray20,
    borderBottomWidth: 1 / PixelRatio.get(),
    flexDirection: 'row'
  },
  break__content: {
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    flexGrow: 1,
    height: 44,
    justifyContent: 'center'
  },
  break__text: {
    backgroundColor: 'transparent',
    color: theme.color.text,
    fontSize: theme.fontSize.small,
    fontWeight: '300'
  },
  'break__text--past': {
    color: theme.color.gray40
  },
  break__title: {
    fontWeight: '600'
  }
});
