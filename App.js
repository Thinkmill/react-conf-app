import React from "react";
import Sentry from "sentry-expo";

Sentry.enableInExpoDevelopment = true;

Sentry.config(
  "https://fcb3e7b7266d4dc5b1edf1fe183abd43@sentry.cloud.sandstorm.de/5"
).install();

import NeosConApp from "./app/NeosCon";

export default NeosConApp;
