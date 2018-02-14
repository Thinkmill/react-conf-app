// @flow
import React, { cloneElement, Component } from 'react';
import {
  Animated,
  Dimensions,
  Modal as RNModal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from 'expo';

function animateToValueWithOptions(val) {
  return {
    toValue: val,
    friction: 10,
    tension: 100,
  };
}

const MODAL_ALIGNMENT = {
  bottom: 'flex-end',
  top: 'flex-start',
  center: 'center',
};

export default class Modal extends Component {
  props: {
    align: 'bottom' | 'center' | 'top',
    blurAmount: number,
    blurType: 'dark' | 'light' | 'xlight',
    onClose: () => mixed,
    style?: {},
    children?: React.Element<{ onClose?: () => mixed }>,
    forceDownwardAnimation?: boolean,
  };

  state = {
    animValue: new Animated.Value(0),
  };

  static defaultProps = {
    align: 'center',
    blurAmount: 12,
    blurType: 'dark',
  };

  __isClosed: boolean | void;

  componentDidMount() {
    Animated.spring(this.state.animValue, animateToValueWithOptions(1)).start();
  }
  onClose = () => {
    const { animValue } = this.state;
    const { onClose } = this.props;

    if (this.__isClosed) return;

    this.__isClosed = true;

    Animated.spring(animValue, animateToValueWithOptions(0)).start(onClose);
  };

  renderChildren() {
    // $FlowFixMe: https://github.com/facebook/flow/issues/1964
    return cloneElement(this.props.children, {
      onClose: this.onClose,
    });
  }
  render() {
    const {
      align,
      blurAmount,
      blurType,
      style,
    } = this.props;

    const blockoutDynamicStyles = {
      justifyContent: MODAL_ALIGNMENT[align],
      opacity: this.state.animValue,
    };

    const getDialogDynamicStyles = () => {
      const scaleTransform = {
        scale: this.state.animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.93, 1],
        }),
      };
      var transformAnimations = [scaleTransform];
      if (this.props.forceDownwardAnimation) {
        const translateTransform = {
          translateY: this.state.animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 1],
          }),
        };
        transformAnimations.push(translateTransform);
      }
      return { transform: transformAnimations };
    };

    // react-native-blur crashes the app on android. Not sure why.
    // To replicate just swap the comments on these lines.
    // const blurView = false
    const blurView = Platform.OS === 'android'
      ? <View style={[styles.blur, { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
          <TouchableOpacity onPress={this.onClose} style={styles.touchable} />
        </View>
      : <BlurView
          blurAmount={blurAmount}
          blurType={blurType}
          style={styles.blur}
        >
          <TouchableOpacity onPress={this.onClose} style={styles.touchable} />
        </BlurView>;

    return (
      <RNModal
        animationType="none"
        transparent
        visible
        onRequestClose={() => {}}
      >
        <Animated.View style={[styles.blockout, blockoutDynamicStyles]}>
          {blurView}
          <Animated.View style={[style, getDialogDynamicStyles()]}>
            {this.props.children}
          </Animated.View>
        </Animated.View>
      </RNModal>
    );
  }
}

const fillSpace = {
  height: Dimensions.get('window').height,
  left: 0,
  position: 'absolute',
  top: 0,
  width: Dimensions.get('window').width,
};
const styles = StyleSheet.create({
  blockout: {
    alignItems: 'center',
    ...fillSpace,
  },
  blur: fillSpace,
  touchable: {
    flex: 1,
  },
});
