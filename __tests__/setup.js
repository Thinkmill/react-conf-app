import React from 'react';
import { View } from 'react-native';

// ------------------------
// React Native Built-Ins
// ------------------------
// React Native UI Manager needs a focus function.
import { UIManager } from 'NativeModules';
UIManager.focus = jest.fn();
UIManager.createView = jest.fn(() => <View />);
UIManager.updateView = jest.fn();

// ------------------------
// NPM Modules
// ------------------------
// Provide a manual mock for native modules.
jest.mock('react-native-maps');
