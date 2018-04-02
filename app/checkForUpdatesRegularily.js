import { AppState, Alert } from "react-native";
import { Updates } from "expo";

export default function checkForUpdatesRegularily() {
  Updates.addListener(() => {
    // we have an update and it was fetched
    // Works on both iOS and Android
    Alert.alert(
      "Update available",
      "An update to the NeosCon app is available",
      [
        { text: "Ask me later", onPress: () => {} },
        {
          text: "Update & Relaunch",
          onPress: () => {
            Expo.Updates.reload();
          }
        }
      ],
      { cancelable: true }
    );
  });
  AppState.addEventListener("change", state => {
    if (state === "active") {
      // check for updates when activating the app again
      Updates.checkForUpdateAsync().then(update => {
        if (update.isAvailable) {
          // fetchUpdateAsync will trigger the "Updates.addListener" handler.
          Updates.fetchUpdateAsync();
        }
      });
    }
  });
}
