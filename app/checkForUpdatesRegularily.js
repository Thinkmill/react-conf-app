import { AppState, Alert } from 'react-native';
import { Updates } from 'expo';
import Raven from 'raven-js';

export default function checkForUpdatesRegularily() {
  return Updates.checkForUpdateAsync().then(update => {
    if (update.isAvailable) {
      return Updates.fetchUpdateAsync().then(e => {
        // we have an update and it was fetched
        // Works on both iOS and Android
        Alert.alert(
          'Update available',
          'An update to the NeosCon app is available',
          [
            { text: 'Ask me later', onPress: () => {} },
            {
              text: 'Update & Relaunch',
              onPress: () => {
                Updates.reload();
              }
            }
          ],
          { cancelable: true }
        );
      });
    } else {
      return Promise.resolve(true);
    }
  });
}
