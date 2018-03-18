import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Sentry from "sentry-expo";

// Sentry.enableInExpoDevelopment = true;

Sentry.config(
  "https://fcb3e7b7266d4dc5b1edf1fe183abd43@sentry.cloud.sandstorm.de/5"
).install();

import ReactConf2017 from "./app/ReactConf2017";

export default ReactConf2017;
