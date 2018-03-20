import React from "react";
import { StackNavigator } from "react-navigation";
import { Platform, StatusBar } from "react-native";

import { Info, Schedule, Talk } from "./scenes";

export default StackNavigator(
  {
    Home: {
      screen: Schedule
    },
    Info: {
      screen: Info
    },
    Talk: {
      screen: Talk
    }
  },
  {
    headerMode: 'none',
    cardStyle: {
      paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    }
  }
);
