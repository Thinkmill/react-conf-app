//
import React, { Component } from 'react';
import SvgUri from 'react-native-svg-uri';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TouchableHighlight,
  View
} from 'react-native';

import theme from '../../../../theme';

const windowHeight = Dimensions.get('window').height;
const SLIDE_DURATION = 800;
const SLIDE_FINAL_HEIGHT = 400;

const SKEW_DELAY = 3000;
const SKEW_DURATION = 2000;
const SKEW_UP = -3;
const SKEW_DOWN = 5;

Animated.TouchableHighlight = Animated.createAnimatedComponent(
  TouchableHighlight
);

export default class SplashScreen extends Component {
  state = {
    animationComplete: false,
    height: new Animated.Value(windowHeight + SLIDE_FINAL_HEIGHT),
    logoOffset: new Animated.Value(0),
    logoScale: new Animated.Value(1),
    leftTriangleSkew: new Animated.Value(SKEW_DOWN),
    rightTriangleSkew: new Animated.Value(SKEW_UP)
  };

  skewed = false;

  componentDidMount() {
    const animateTo = toValue => {
      return {
        delay: 1000,
        duration: SLIDE_DURATION,
        toValue
      };
    };

    Animated.parallel([
      Animated.timing(this.state.logoOffset, animateTo(80)),
      Animated.timing(this.state.logoScale, animateTo(0.8)),
      Animated.timing(
        this.state.height,
        animateTo(SLIDE_FINAL_HEIGHT + theme.navbar.height)
      )
    ]).start(() => {
      if (this.props.onAnimationComplete) {
        this.props.onAnimationComplete();
      }
      this.setState({ animationComplete: true });
      this.queueIdleAnimation();
    });
  }

  componentDidUpdate() {
    const { animationComplete, logoOffset, logoScale } = this.state;

    if (animationComplete) {
      logoOffset.setValue(80);
      logoScale.setValue(0.8);
    }
  }

  queueIdleAnimation = () => {
    const { leftTriangleSkew, rightTriangleSkew } = this.state;

    const animateTo = toValue => {
      return {
        duration: SKEW_DURATION,
        toValue
      };
    };

    const leftSkew = this.skewed ? SKEW_UP : SKEW_DOWN;
    const rightSkew = this.skewed ? SKEW_DOWN : SKEW_UP;

    // Toggle for next time
    this.skewed = !this.skewed;

    Animated.parallel([
      // -------- Left Triangle --------
      Animated.timing(leftTriangleSkew, animateTo(leftSkew)),
      Animated.timing(rightTriangleSkew, animateTo(rightSkew))
    ]).start(() => {
      setTimeout(() => this.queueIdleAnimation(), SKEW_DELAY);
    });
  };

  render() {
    const {
      animationComplete,
      height,
      logoOffset,
      logoScale,
      leftTriangleSkew,
      rightTriangleSkew
    } = this.state;

    // Map to string values for transform.
    const interpolateToString = value => {
      return value.interpolate({
        inputRange: [-360, 360],
        outputRange: ['-360deg', '360deg']
      });
    };

    const wrapperHeight = Animated.add(height, new Animated.Value(-200));

    return (
      <Animated.View
        style={[styles.wrapper, this.props.style, { height: wrapperHeight }]}
      >
        {/* The actual splash screen */}
        <Animated.View style={[styles.splash, { height }]}>
          <Animated.TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              if (this.props.onLogoPress) this.props.onLogoPress();
            }}
            style={{
              transform: [{ translateY: logoOffset }, { scale: logoScale }],
              zIndex: 2
            }}
          >
            <SvgUri
              width='300'
              height='180'
              source={require('../../images/neos-conference-2019-dark.svg')}
            />
          </Animated.TouchableHighlight>
          <Animated.View
            style={[
              styles.bottomTriangle,
              {
                transform: [{ skewY: interpolateToString(leftTriangleSkew) }]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.bottomTriangle,
              {
                transform: [
                  { skewY: interpolateToString(rightTriangleSkew) },
                  { translateY: -5 }
                ]
              }
            ]}
          />
        </Animated.View>
      </Animated.View>
    );
  }
}

const screen = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: screen.width,
    zIndex: 2
  },

  splash: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: -200,
    left: 0,
    right: 0
  },

  bottomTriangle: {
    position: 'absolute',
    backgroundColor: 'rgba(36, 37, 76, 0.8)',
    bottom: 40,
    height: 1200,
    left: -100,
    right: -100
  }
});
