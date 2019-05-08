//
import React from 'react';
import {
  Dimensions,
  PixelRatio,
  Platform,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import theme from '../../../../theme';

export default function NavbarIOS({
  backgroundColor = theme.navbar.backgroundColor,
  buttonColor = theme.navbar.buttonColor,
  leftButtonDisabled,
  leftButtonIconName,
  leftButtonOnPress,
  leftButtonText,
  rightButtonDisabled,
  rightButtonIconName,
  rightButtonOnPress,
  rightButtonText,
  textColor = theme.navbar.textColor,
  title,
  titleRenderer,
  ...props
}) {
  return (
    <View {...props}>
      <SafeAreaView style={{ height: theme.navbar.height }} />
      <SafeAreaView
        style={[styles.container, { backgroundColor: backgroundColor }]}
      >
        {/* Left Button */}
        {leftButtonOnPress ? (
          <TouchableOpacity
            disabled={leftButtonDisabled}
            onPress={leftButtonOnPress}
            style={[styles.button, styles.leftButton]}
          >
            {!!leftButtonIconName && (
              <Icon
                color={theme.navbar.buttonColor}
                name={leftButtonIconName}
                size={36}
                style={{ marginRight: 10, height: 36 }}
              />
            )}
            <Text
              style={[
                styles.buttonText,
                { opacity: leftButtonDisabled ? 0.6 : 1 }
              ]}
            >
              {leftButtonText}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.button} />
        )}

        {/* Title */}
        {titleRenderer ? (
          titleRenderer()
        ) : (
          <View style={styles.title}>
            <Text style={[styles.titleText, { color: textColor }]}>
              {title}
            </Text>
          </View>
        )}

        {/* Right Button */}
        {rightButtonOnPress ? (
          <TouchableOpacity
            disabled={rightButtonDisabled}
            onPress={rightButtonOnPress}
            style={[styles.button, styles.button__right]}
          >
            {!!rightButtonIconName && (
              <Icon
                color={theme.navbar.buttonColor}
                name={rightButtonIconName}
                size={36}
                style={{ marginLeft: 10, height: 36 }}
              />
            )}
            <Text
              style={[
                styles.buttonText,
                { opacity: rightButtonDisabled ? 0.6 : 1 }
              ]}
            >
              {rightButtonText}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.button} />
        )}
      </SafeAreaView>
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
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 20 : 0, // account for the statusbar
    position: 'absolute',
    width: Dimensions.get('window').width
  },

  // buttons
  button: {
    alignItems: 'center',
    flex: 3,
    flexDirection: 'row',
    paddingHorizontal: theme.fontSize.default
  },
  button__right: {
    justifyContent: 'flex-end'
  },
  buttonText: {
    color: theme.color.blue,
    fontSize: theme.fontSize.default
  },

  // title
  title: {
    alignItems: 'center',
    flex: 4,
    justifyContent: 'center'
  },
  titleText: {
    color: theme.color.lightText,
    fontSize: theme.fontSize.default,
    fontWeight: '500'
  }
});
