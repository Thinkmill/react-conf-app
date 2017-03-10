import { Component } from 'react';
import { BackAndroid } from 'react-native';

export default class EnhancedScene extends Component {
  backPress = () => {
    this.props.navigator.pop();
    return true;
  };
  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.backPress);
  }
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.backPress);
  }
}
