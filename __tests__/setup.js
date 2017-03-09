// @flow
import React from 'react';
import { View } from 'react-native';

// ------------------------
// Javascript Built-Ins
// ------------------------
// Ensure Date.now and new Date() give us the same date for snapshots.
import timekeeper from 'timekeeper';
timekeeper.freeze(new Date(2017, 3, 1, 8, 0, 0));

// ------------------------
// React Native Built-Ins
// ------------------------
// React Native UI Manager needs a focus function.
// $FlowFixMe
import { UIManager } from 'NativeModules';
UIManager.focus = jest.fn();
UIManager.createView = jest.fn(() => <View />);
UIManager.updateView = jest.fn();

// ------------------------
// NPM Modules
// ------------------------
// Provide a manual mock for native modules.
jest.mock('react-native-maps');
