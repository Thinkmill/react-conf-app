// @flow
import React, { Component } from 'react';
import {
  StackNavigator,
} from 'react-navigation';
import { AppState, StatusBar, StyleSheet } from 'react-native';

import theme from './theme';
import { Info, Schedule, Talk } from './scenes';

export default StackNavigator({
  Home: {
    screen: Schedule,
  },
  Info: {
    screen: Info,
  },
  Talk: {
    screen: Talk,
  },
}, {
    headerMode: 'none'
  });