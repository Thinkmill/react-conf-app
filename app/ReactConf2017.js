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

		const configureScene = (route) => {
			return route.sceneConfig
				? Navigator.SceneConfigs[route.sceneConfig]
				: Navigator.SceneConfigs.HorizontalSwipeJump;
		};

		return (
			<Navigator
				initialRoute={{ scene: DEFAULT_VIEW, index: 0 }}
				renderScene={renderScene}
				configureScene={configureScene}
				style={styles.container}
			/>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'black',
		flex: 1,
	},
});

module.exports = ReactConf2017;
