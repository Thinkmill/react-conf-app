import React from "react";
import { StackNavigator } from "react-navigation";
import { Platform, StatusBar, AsyncStorage } from "react-native";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { Info, Schedule, Talk } from "./scenes";
import { actions, reducer, storageMiddleware } from "./redux/index";
import registerRatingNotifications from "./ratingNotifications";
import checkForUpdatesRegularily from "./checkForUpdatesRegularily";

registerRatingNotifications();
checkForUpdatesRegularily();
const store = createStore(
  reducer,
  { ratings: {} },
  applyMiddleware(storageMiddleware)
);

AsyncStorage.getItem("@NeosCon.state").then(
  state => {
    if (state) {
      store.dispatch(actions.restoreStateFromStorage(JSON.parse(state)));
    }
  },
  error => {
    // do nothing if ratings could not be loaded.
  }
);

// define light status bar for whole app
StatusBar.setBarStyle("light-content", true);

const App = StackNavigator(
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
    headerMode: "none",
    cardStyle: {
      paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
    }
  }
);

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
