import { Platform, Dimensions } from 'react-native';

// ==============================
// APP STYLE CONSTANTS
// ==============================

// color
const color = {
  blue: '#00ADEE',
  darkBlue: '#26224C',
  green: '#9BE13A',
  text: '#383838',
  lightText: 'white',
  sceneBg: '#F4F4F4',
  splashBg: '#2B2828',
  yellow: '#FFC979',

  // neutrals
  gray90: '#1A1A1A',
  gray80: '#333',
  gray70: '#4D4D4D',
  gray60: '#666',
  gray50: '#7F7F7F',
  gray40: '#999',
  gray35: '#A6A6A6',
  gray30: '#B3B3B3',
  gray25: '#BFBFBF',
  gray20: '#CCC',
  gray15: '#D9D9D9',
  gray10: '#E5E5E5',
  gray05: '#F2F2F2'
};

// font sizes
const fontSize = {
  xsmall: 12,
  small: 14,
  default: 17,
  large: 24,
  xlarge: 32
};

// Component Specific
// ------------------------------

const isIphoneX = () => {
  let d = Dimensions.get('window');
  const { height, width } = d;
  return Platform.OS === 'ios' && (height >= 812 || width >= 812);
};

// navbar
const navbar = {
  backgroundColor: color.darkBlue,
  buttonColor: color.blue,
  height: isIphoneX() ? 84 : 64,
  textColor: color.lightText
};

// list header
const listheader = {
  height: 34
};

// next up
const nextup = {
  height: Platform.OS === 'ios' ? 70 : 110
};

const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;
const statusBarHeight = Platform.OS === 'ios' ? 20 : 24;
const talkPaneAndroidMinScrollAreaHeight = Dimensions.get('window').height - 48;

export default {
  color,
  fontSize,
  navbar,
  nextup,
  listheader,
  talkPaneAndroidMinScrollAreaHeight,
  statusBarHeight,
  isIphoneX,
  fullHeight,
  fullWidth
};
