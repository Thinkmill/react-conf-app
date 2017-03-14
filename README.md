# React Conf 2017

The companion app for [React Conf 2017](http://conf.reactjs.org) in Santa Clara, California. Powered by [React Native](https://facebook.github.io/react-native/), and built in Sydney by [Thinkmill](https://www.thinkmill.com.au).

<a href="http://thinkmill.com.au/?utm_source=github&amp;utm_medium=badge&amp;utm_campaign=react-conf-app"><img src="https://camo.githubusercontent.com/1752e09ecedba599946d84f1b465bc1176434d5a/68747470733a2f2f7468696e6b6d696c6c2e6769746875622e696f2f62616467652f68656172742e737667" alt="Supported by Thinkmill" data-canonical-src="https://thinkmill.github.io/badge/heart.svg" style="max-width:100%;"></a>

[Find it on the iOS App Store here](https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=1212174348&mt=8)!
[Find it on Google Play here](https://play.google.com/store/apps/details?id=com.reactconf2017)!

Get a live schedule, information about the talks and speakers, and easily tweet or share talks as they happen.

## About the App

We're open sourcing this app so everyone can see how we built it, and contribute to making it better.

There will be design tweaks and updates as we lead up to the conference - we'll also be publishing the final Sketch files when they're ready.

PRs and feedback are welcome, let us know what you think!

And for those of you who will be attending, we hope you enjoy the app, and we'll see you there.

## Getting Started

To run the app, clone this repo then:

### iOS

1. Use `yarn` to install the dependencies.
2. Open the project in XCode and click the run button. You should be good to go!

### Android

The Android build requires a Google Maps API key for the map component. You can [get one here](https://developers.google.com/maps/documentation/android-api/signup).

Once you have an API key, you'll need to add it to the build. We use Android's string handling to get it into the app. Create a file in `android/app/src/main/res/values` called `google_maps_api_key.xml` with these contents:

```
<resources>
    <string name="google_maps_api_key">[Your Google Maps API Key Here]</string>
</resources>
```

Then:

1. Use `yarn` to install the dependencies.
2. Either use `react-native run-android` or open the project in the `android` directory in Android Studio and click the run button.

## Support / Contributing

If you have any trouble with the app, please [open an issue](https://github.com/Thinkmill/react-conf-app/issues/new) to let us know!

Even better, help us improve it by forking and submitting a Pull Request.

## Other Conferences?

We'd love to hear from anyone who wants to fork this app and customise it for other conferences. We've got some ideas about how to make it easier that we'd be happy to talk about if there's interest.

## Credits

[Thinkmill](https://www.thinkmill.com.au) set aside some project time to build this app because we wanted to hack on a fresh React Native project, try some new things and we're excited about the conference.

The following people made it happen:

* [Boris Bozic](https://twitter.com/borisbozic) - Design
* [Jed Watson](http://twitter.com/jedwatson) - Concept and Architecture
* [Joss Mackison](https://twitter.com/jossmackison) - UI
* [Kevin Brown](https://github.com/blargity) - Programming

Also thanks to [James Kyle](https://twitter.com/thejameskyle) for his review & contributions.

We've incorporated some cool tech including:

* [Code Push](http://microsoft.github.io/code-push/)
* [Jest](https://facebook.github.io/jest/)
* [Flow](https://flowtype.org)
* [Prettier](https://github.com/prettier/prettier)

See [package.json](./package.json) for the full set of react native packages we used.

# License

MIT Licensed. Copyright (c) Thinkmill Pty Ltd 2017.
