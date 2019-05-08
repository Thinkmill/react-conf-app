import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Platform, StatusBar, AsyncStorage, Image } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Info, Schedule, Talk } from './scenes';
import { actions, reducer, storageMiddleware } from './redux/index';
import registerRatingNotifications from './ratingNotifications';
import checkForUpdatesRegularily from './checkForUpdatesRegularily';
import { getImages } from './data/talks';
import { AppLoading, Asset, Constants } from 'expo';

registerRatingNotifications();
checkForUpdatesRegularily();
const store = createStore(
  reducer,
  { ratings: {} },
  applyMiddleware(storageMiddleware)
);

AsyncStorage.getItem('@NeosCon.state').then(
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
StatusBar.setBarStyle('light-content', true);

const MainNavigator = createStackNavigator(
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
    headerMode: 'none'
  }
);

const cacheImages = images => {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

export default class NeosCon extends React.Component {
  state = {
    isReady: false
  };

  async _loadAssetsAsync() {
    const images = getImages();

    // add local images
    images.push(require('./scenes/Info/images/alter_schlachthof.png'));
    images.push(require('./scenes/Info/images/hellmuts.png'));

    const imageAssets = cacheImages(images);
    await Promise.all([...imageAssets]);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    const App = createAppContainer(MainNavigator);
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
