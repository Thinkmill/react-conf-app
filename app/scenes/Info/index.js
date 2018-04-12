//
import React, { Component } from "react";
import {
  Image,
  LayoutAnimation,
  PixelRatio,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MapView from "react-native-maps";
import HTMLView from "react-native-htmlview";
import BackButtonAndroid from "../../components/BackButtonAndroid";
import ListTitle from "../../components/ListTitle";
import Navbar from "../../components/Navbar";
import Scene from "../../components/Scene";

import { list as organiserList } from "../../data/organisers";
import theme from "../../theme";
import { attemptToOpenUrl } from "../../utils";

import CodeOfConduct from "./components/CodeOfConduct";
import Organiser from "./components/Organiser";

const htmlContent = `
<h4>Thanks!</h4>
<p>This app was originally created and <a href="https://github.com/Thinkmill/react-conf-app">open sourced</a> by <a href="https://www.thinkmill.com.au/">Thinkmill</a> (Sydney, Australia).</p>
<p>It was heavily modified and adjusted to Neos Con by <a href="https://sandstorm.de">Sandstorm Media</a>. The adjusted source code can also be <a href="https://github.com/sandstorm/neos-conf-app">found on GitHub</a>.

<h4>Angaben gemäß §5 TMG</h4>

<p>Sandstorm Media GmbH</p>
<p>Blasewitzer Str. 41</p>
<p>01307 Dresden</p>

<h4>Vertreten durch:</h4>

<p>Geschäftsführer: Florian Heinze</p>
<p>Geschäftsführer: Tobias Gruber</p>

<h4>Kontakt</h4>

<p>Telefon:&nbsp;+49 351 418 96 49</p>
<p>Email: kontakt(at)sandstorm-media.de</p>

<h4>Registereintrag</h4>

<p>Registergericht: Amtsgericht Dresden</p>
<p>Registernummer: HRB 27395</p>

<h4>Umsatzsteuer-ID und Steuernummer</h4>

<p>Ust.-ID-Nr. gemäß §27 a Umsatzsteuergesetz: DE 264 953 453</p>
<p>Steuernummer: 203/118/06174</p>

<h4>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h4>

<p>Sebastian Kurfürst</p>
<p>Blasewitzer Str. 41</p>
<p>01307 Dresden</p>
`.replace(/\n/g, "");

// Hamburg
const mapRegion = {
  latitude: 53.5562832,
  longitude: 9.9812613,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01
};

class Info extends Component {
  state = {
    modalIsOpen: false
  };

  static defaultProps = {
    organisers: organiserList
  };

  componentDidMount() {
    // Sometimes it takes more than a second for the map to load, so in those cases it's best to
    // just keep trying with an exponential* back off. (* exponential: e to the power of 0) ;-)
    const tryToShowCallout = () => {
      if (this._marker) {
        this._marker.showCallout();
      } else {
        setTimeout(tryToShowCallout, 1000);
      }
    };

    tryToShowCallout();
  }

  toggleModal = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  };

  openMap() {
    const latlon = `${mapRegion.latitude},${mapRegion.longitude}`;
    const query = encodeURI("Hamburg, Dammtorwall 15");
    const url =
      Platform.OS === "ios"
        ? `maps://maps.apple.com/?ll=${latlon}&q=${query}`
        : `https://maps.google.com/?ll=${latlon}&q=${query}`;

    attemptToOpenUrl(url);
  }
  openThinkmill() {
    const url = "https://www.thinkmill.com.au";
    attemptToOpenUrl(url);
  }

  openRepository() {
    const url = "https://github.com/Thinkmill/react-conf-2017";
    attemptToOpenUrl(url);
  }

  render() {
    const { navigation, organisers } = this.props;
    const { modalIsOpen } = this.state;

    const isAndroid = Platform.OS === "android";

    return (
      <Scene>
        <Navbar
          title="About"
          leftButtonIconName={isAndroid ? "md-arrow-back" : "ios-arrow-back"}
          leftButtonOnPress={() => {
            navigation.goBack();
          }}
          rightButtonIconName={isAndroid ? "md-navigate" : null}
          rightButtonText={!isAndroid ? "Directions" : null}
          rightButtonOnPress={this.openMap}
        />
        <ScrollView>
          <MapView initialRegion={mapRegion} style={styles.map}>
            <MapView.Marker
              coordinate={mapRegion}
              description="Dammtorwall 15, Hamburg"
              onCalloutPress={this.openMap}
              ref={r => {
                this._marker = r;
              }}
              title="Nord Event Panoramadeck"
            />
          </MapView>

          <View style={{ flex: 1 }}>
            <View style={styles.hero}>
              <Text style={styles.heroText}>
                The conference will be taking place on April 13th and April
                14th.
              </Text>

              <Text style={styles.heroHeader}>Location</Text>
              <Text style={styles.heroText}>
                Aiming high in 2018! The Neos Conference 2018 will be at the
                Nord Event Panoramadeck - the 23rd floor of the Emporio Tower in
                Hamburg. With a 360° view of Hamburg we have the whole floor to
                ourselves for two tracks, networking and exchange.
              </Text>

              <Text style={styles.heroHeader}>
                Conference Warm-Up - 12th April
              </Text>
              <Text style={styles.heroText}>
                Join us for a few drinks at our Warm-Up Event - we organized a
                few tables during Live-Music-Night at “Bricks Tea Lounge and
                Bar” (Große Bleichen 36, 20354 Hamburg) at 7 p.m.
              </Text>

              <Text style={styles.heroHeader}>Social Event</Text>
              <Text style={styles.heroText}>
                Join us for the Neos Conference 2018 Social Event at Nochtwache
                Hamburg on April 13th. Admission is inlcuded in the Conference
                Ticket. Start at 8 p.m.
              </Text>

              <TouchableOpacity onPress={this.toggleModal} activeOpacity={0.75}>
                <Text style={styles.heroLink}>Code of Conduct</Text>
              </TouchableOpacity>
            </View>

            <HTMLView
              value={htmlContent}
              stylesheet={htmlStyles}
              addLineBreaks={false}
              style={{
                padding: 20
              }}
            />
          </View>
        </ScrollView>

        {!!modalIsOpen && <CodeOfConduct onClose={this.toggleModal} />}
      </Scene>
    );
  }
}

const htmlStyles = StyleSheet.create({
  h4: { fontWeight: "500", fontSize: 18, paddingTop: 20, paddingBottom: 10 }
});

export default BackButtonAndroid()(Info);

const styles = StyleSheet.create({
  map: {
    flex: 1,
    height: 200,
    maxHeight: 200
  },
  // hero
  hero: {
    alignItems: "center",
    backgroundColor: "white",
    borderBottomColor: theme.color.gray20,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderTopColor: theme.color.gray30,
    borderTopWidth: 1 / PixelRatio.get(),
    paddingHorizontal: theme.fontSize.default
  },
  heroText: {
    paddingTop: theme.fontSize.small,
    fontSize: theme.fontSize.default,
    fontWeight: "300",
    lineHeight: theme.fontSize.large,
    textAlign: "center"
  },
  heroHeader: {
    paddingTop: theme.fontSize.large,
    fontSize: theme.fontSize.large,
    fontWeight: "300",
    lineHeight: theme.fontSize.large,
    textAlign: "center"
  },
  heroLink: {
    color: theme.color.blue,
    fontSize: theme.fontSize.default,
    fontWeight: "500",
    padding: theme.fontSize.large
  }
});
