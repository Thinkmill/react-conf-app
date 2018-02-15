// 
import React from 'react';
import {
  Dimensions,
  PixelRatio,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import theme from '../../../../theme';


export default function NavbarAndroid(
  {
    backgroundColor = '#1C90D4',
    buttonColor = 'rgba(0, 0, 0, 0.5)',
    leftButtonDisabled,
    leftButtonIconName,
    leftButtonOnPress,
    leftButtonText,
    rightButtonDisabled,
    rightButtonIconName,
    rightButtonOnPress,
    rightButtonText,
    textColor = 'white',
    title,
    titleRenderer,
    ...props
  }
) {
  console.log('android navbar');
  return (
    <View {...props}>
      <View style={{ height: theme.navbar.height }} />
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        {/* Left Button */}
        {leftButtonOnPress
          ? <TouchableOpacity
              activeOpacity={0.6}
              disabled={leftButtonDisabled}
              onPress={leftButtonOnPress}
              style={[styles.button, styles.leftButton]}
            >
              {!!leftButtonIconName &&
                <Icon
                  color="rgba(0, 0, 0, 0.5)"
                  name={leftButtonIconName}
                  size={32}
                  style={{ marginRight: 10, height: 32 }}
                />}
            </TouchableOpacity>
          : <View style={styles.button} />}

        {/* Title */}
        {titleRenderer
          ? titleRenderer()
          : <View style={styles.title}>
              <Text style={[styles.titleText, { color: textColor }]}>
                {title}
              </Text>
            </View>}

        {/* Right Button */}
        {rightButtonOnPress
          ? <TouchableOpacity
              activeOpacity={0.6}
              disabled={rightButtonDisabled}
              onPress={rightButtonOnPress}
              style={[styles.button, styles.button__right]}
            >
              {!!rightButtonIconName &&
                <Icon
                  color="white"
                  name={rightButtonIconName}
                  size={32}
                  style={{ marginLeft: 10, height: 32 }}
                />}
            </TouchableOpacity>
          : <View style={styles.button} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    borderBottomColor: theme.color.gray20,
    borderBottomWidth: 1 / PixelRatio.get(),
    flexDirection: 'row',
    height: theme.navbar.height,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 20 : 0, // account for the statusbar
    position: 'absolute',
    width: Dimensions.get('window').width,
  },

  // buttons
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: theme.fontSize.default,
  },
  button__right: {
    justifyContent: 'flex-end',
  },
  buttonText: {
    color: theme.color.blue,
    fontSize: theme.fontSize.default,
  },

  // title
  title: {
    alignItems: 'center',
    flex: 4,
    justifyContent: 'center',
  },
  titleText: {
    color: theme.color.lightText,
    fontSize: theme.fontSize.default,
    fontWeight: '500',
  },
});
