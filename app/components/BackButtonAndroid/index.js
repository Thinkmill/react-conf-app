import React from 'react';
import { BackHandler } from 'react-native';

export default () => Component =>
  class BackButtonAndroid extends React.Component {
    backPress = () => {
      this.props.navigation.goBack();
      return true;
    };
    componentWillMount() {
      BackHandler.addEventListener('hardwareBackPress', this.backPress);
    }
    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.backPress);
    }
    render() {
      return <Component {...this.props} />;
    }
  };
