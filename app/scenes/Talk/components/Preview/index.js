// @flow
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import theme from '../../../../theme';

type Props = {
  isActive?: boolean,
  position: 'top' | 'bottom',
  subtitle: string,
  title: string,
};

const ICON_VARIANT = {
  bottom: 'ios-arrow-up',
  top: 'ios-arrow-down',
};

const animateToValue = val => ({
  toValue: val,
  duration: 150,
});

export default class Preview extends Component {
  props: Props;

  state = {
    animValue: new Animated.Value(0),
  };

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.isActive && nextProps.isActive) {
      this.tada();
    }
  }

  tada() {
    const { animValue } = this.state;

    Animated.timing(animValue, animateToValue(1)).start(() => {
      Animated.timing(animValue, animateToValue(0)).start();
    });
  }
  render() {
    const {
      position,
      subtitle,
      title,
    } = this.props;
    const { animValue } = this.state;

    const isAndroid = Platform.OS === 'android';

    const baseStyles = position === 'bottom'
      ? isAndroid ? { bottom: 0 } : { bottom: -theme.nextup.height }
      : { top: -theme.nextup.height };

    const icon = (
      <Animated.View
        style={{
          backgroundColor: 'transparent',
          transform: [
            {
              scale: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.5],
              }),
            },
          ],
        }}
      >
        <Icon
          color={theme.color.text}
          name={ICON_VARIANT[position]}
          size={20}
        />
      </Animated.View>
    );

    const containerStyles = isAndroid
      ? [styles.base, baseStyles]
      : [styles.base, styles.baseIos, baseStyles];

    return (
      <View style={containerStyles}>
        {position === 'bottom' && icon}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle &&
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>}
        {position === 'top' && icon}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    height: theme.nextup.height,
    paddingHorizontal: 60,
    width: Dimensions.get('window').width,
  },
  baseIos: {
    position: 'absolute',
    left: 0,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    color: theme.color.gray60,
    textAlign: 'center',
  },
});
