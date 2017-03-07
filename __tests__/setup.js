// @flow
import React from 'react';
import { View } from 'react-native';

// ------------------------
// Javascript Built-Ins
// ------------------------
// Ensure Date.now and new Date() give us the same date for snapshots.
import mockdate from 'mockdate';
mockdate.set(1422778155399, -660);

// ------------------------
// React Native Built-Ins
// ------------------------
// React Native UI Manager needs a focus function.
// $FlowFixMe
import { UIManager } from 'NativeModules';
UIManager.focus = jest.fn();
UIManager.createView = jest.fn(() => <View />);
UIManager.updateView = jest.fn();

import { Dimensions } from 'react-native';
Dimensions.__oldGet = Dimensions.get;
Dimensions.get = key => {
  // Our screen doensn't have dimensions in snapshot testing, but other things do, so let them continue to work.
  if (key === 'screen') {
    return { width: 1024, height: 768 };
  }

  return Dimensions.__oldGet(key);
};

// ------------------------
// NPM Modules
// ------------------------
// Provide a manual mock for native modules.
jest.mock('react-native-maps');
