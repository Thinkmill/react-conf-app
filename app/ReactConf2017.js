import React, { Component } from 'react';
import { AppState, Navigator, StatusBar, StyleSheet } from 'react-native';
import codePush from 'react-native-code-push';

import theme from './theme';
import { Info, Schedule, Talk } from './scenes';
const Scenes = { Info, Schedule, Talk };

const DEFAULT_VIEW = 'Schedule';

class ReactConf2017 extends Component {
	componentDidMount () {
		// this.syncAppVersion();
		StatusBar.setBarStyle('default', true);
		AppState.addEventListener('change', this.handleAppStateChange);
	}
	componentWillUnmount () {
		AppState.removeEventListener('change', this.handleAppStateChange);
	}
	handleAppStateChange (currentAppState) {
		console.log('handleAppStateChange', currentAppState);
		// if (currentAppState === 'active') {
			// this.syncAppVersion();
		// }
	}
	syncAppVersion () {
		codePush.sync({ mandatoryInstallMode: codePush.InstallMode.IMMEDIATE });
	}
	render () {
		const renderScene = (route, navigator) => {
			const SceneComponent = Scenes[route.scene];

			return <SceneComponent {...route.props} navigator={navigator} />;
		};

		const TRANSITION_KEYS = Object.keys(Navigator.SceneConfigs);

		console.log('Navigator.SceneConfigs', Navigator.SceneConfigs);

		const configureScene = (route) => {
			if (route.transitionKey && !TRANSITION_KEYS.includes(route.transitionKey)) {
				console.warn('Warning: Invalid transition key `' + route.transitionKey + '` supplied to `Navigator`. Valid keys: [\n' + TRANSITION_KEYS.join('\n') + '\n]')
				return Navigator.SceneConfigs.PushFromRight;
			}

			return route.transitionKey
				? Navigator.SceneConfigs[route.transitionKey]
				: {
					...Navigator.SceneConfigs.PushFromRight,
					gestures: route.enableSwipeToPop ? {
						pop: Navigator.SceneConfigs.PushFromRight.gestures.pop
					} : null,
				};
		};

		return (
			<Navigator
				initialRoute={{ scene: DEFAULT_VIEW, index: 0 }}
				renderScene={renderScene}
				configureScene={configureScene}
				style={styles.navigator}
				sceneStyle={{
					backgroundColor: theme.color.viewBg,
					overflow: 'visible',
					shadowColor: 'black',
					shadowOffset: { height: 0, width: 0 },
					shadowOpacity: 0.33,
					shadowRadius: 5,
				}}
			/>
		);
	}
};

const styles = StyleSheet.create({
	navigator: {
		backgroundColor: 'black',
		flex: 1,
	},
});

module.exports = ReactConf2017;
