// 
import { Linking } from 'react-native';

export default function attemptToOpenUrl(url) {
  if (!url) return console.error('Invalid URL supplied.');

  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Linking to URL not supported on device.');
      }
    })
    .catch(err => console.error('An error occurred', err));
}
