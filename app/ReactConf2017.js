// @flow
import React, { Component } from 'react';
import { AppState, Navigator, StatusBar, StyleSheet } from 'react-native';

import theme from './theme';
import { Info, Schedule, Talk } from './scenes';
const Scenes = { Info, Schedule, Talk };

const DEFAULT_VIEW = 'Schedule';

class ReactConf2017 extends Component {
  componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
  }

  render() {
    const renderScene = (route, navigator) => {
      const SceneComponent = Scenes[route.scene];

      return <SceneComponent {...route.props} navigator={navigator} />;
    };

    const TRANSITION_KEYS = Object.keys(Navigator.SceneConfigs);

    const configureScene = route => {
      if (
        route.transitionKey && !TRANSITION_KEYS.includes(route.transitionKey)
      ) {
        console.warn(
          'Warning: Invalid transition key `' +
            route.transitionKey +
            '` supplied to `Navigator`. Valid keys: [\n' +
            TRANSITION_KEYS.join('\n') +
            '\n]'
        );
        return Navigator.SceneConfigs.PushFromRight;
      }

      return route.transitionKey
        ? Navigator.SceneConfigs[route.transitionKey]
        : {
            ...Navigator.SceneConfigs.PushFromRight,
            gestures: route.enableSwipeToPop
              ? {
                  pop: Navigator.SceneConfigs.PushFromRight.gestures.pop,
                }
              : null,
          };
    };

    return (
      <Navigator
        configureScene={configureScene}
        initialRoute={{ scene: DEFAULT_VIEW, index: 0 }}
        renderScene={renderScene}
        sceneStyle={styles.scenes}
        style={styles.navigator}
      />
    );
  }
}

const styles = StyleSheet.create({
  navigator: {
    backgroundColor: 'black',
    flex: 1,
  },
  scenes: {
    backgroundColor: theme.color.sceneBg,
    overflow: 'visible',
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.33,
    shadowRadius: 5,
  },
});

module.exports = ReactConf2017;
