// @flow
import React, { cloneElement, Component } from 'react';
import {
  Animated,
  Dimensions,
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Components } from 'exponent';
const { BlurView } = Components;

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
    const dialogDynamicStyles = {
      transform: [
        {
          scale: this.state.animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.93, 1],
          }),
        },
        {
          translateY: this.state.animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 1],
          }),
        },
      ],
    };

    return (
      <RNModal animationType="none" transparent visible>
        <Animated.View style={[styles.blockout, blockoutDynamicStyles]}>
          <BlurView
            blurAmount={blurAmount}
            blurType={blurType}
            style={styles.blur}
          >
            <TouchableOpacity onPress={this.onClose} style={styles.touchable} />
          </BlurView>
          <Animated.View style={[style, dialogDynamicStyles]}>
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
