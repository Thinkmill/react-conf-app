import React from 'react';
import { BackAndroid } from 'react-native';

export default () => Component =>
  class BackButtonAndroid extends React.Component {
    backPress = () => {
      this.props.navigator.pop();
      return true;
    };
    componentWillMount() {
      console.log('HOC, cwm');
      BackAndroid.addEventListener('hardwareBackPress', this.backPress);
    }
    componentWillUnmount() {
      BackAndroid.removeEventListener('hardwareBackPress', this.backPress);
    }
    render() {
      return <Component {...this.props} />;
    }
  };
