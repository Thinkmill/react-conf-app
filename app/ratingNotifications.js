import { Notifications, Permissions } from "expo";
import { Alert } from "react-native";
import moment from "moment-timezone";

import talks from "./data/talks";

const setUpNotifications = () => {
  // TODO: Two notifications at the same time!!
  Notifications.cancelAllScheduledNotificationsAsync().then(() => {
    talks.forEach((talk, index) => {
      if (!talk.ratingEnabled) {
        return;
      }
      if (talk.endTime && talk.endTime.isAfter(moment())) {
        Notifications.scheduleLocalNotificationAsync(
          {
            title: talk.title,
            body: "It is time to rate this talk!",
            data: {
              talkIndex: index
            }
          },
          {
            time: talk.endTime.toDate()
          }
        );
      }
    });
  });
};

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );

  if (existingStatus === "granted") {
    setUpNotifications();
  } else {
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.

    Permissions.askAsync(Permissions.NOTIFICATIONS).then(result => {
      /*if (result.status !== "granted") {
        return;
      }*/

      setUpNotifications();
    });
  }
}

export default registerForPushNotificationsAsync;
