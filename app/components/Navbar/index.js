import { Platform } from 'react-native';
import NavbarAndroid from './components/NavbarAndroid';
import NavbarIOS from './components/NavbarIOS';

export default (Platform.OS === 'android' ? NavbarAndroid : NavbarIOS);
