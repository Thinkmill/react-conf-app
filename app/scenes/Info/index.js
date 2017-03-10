// @flow
import React, { Component } from 'react';
import {
  Image,
  LayoutAnimation,
  PixelRatio,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';

import EnhancedScene from '../../components/EnhancedScene';
import ListTitle from '../../components/ListTitle';
import Navbar from '../../components/Navbar';
import Scene from '../../components/Scene';

import { list as organiserList } from '../../data/organisers';
import theme from '../../theme';
import { attemptToOpenUrl } from '../../utils';

import CodeOfConduct from './components/CodeOfConduct';
import Organiser from './components/Organiser';

// Santa Clara, California
const mapRegion = {
  latitude: 37.391084,
  longitude: -121.9746,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

class Info extends Component {
  props: {
    navigator: Object,
    organisers: typeof organiserList,
  };

  state = {
    modalIsOpen: false,
  };

  static defaultProps = {
    organisers: organiserList,
  };

  _marker: any;

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
    const query = encodeURI('Santa Clara Marriott');
    const url = Platform.OS === 'ios'
      ? `maps://maps.apple.com/?ll=${latlon}&q=${query}`
      : `https://maps.google.com/?ll=${latlon}&q=${query}`;

    attemptToOpenUrl(url);
  }
  openThinkmill() {
    const url = 'https://www.thinkmill.com.au';
    attemptToOpenUrl(url);
  }

  openRepository() {
    const url = 'https://github.com/Thinkmill/react-conf-2017';
    attemptToOpenUrl(url);
  }

  render() {
    const { navigator, organisers } = this.props;
    const { modalIsOpen } = this.state;

    return (
      <Scene>
        <Navbar
          title="About"
          leftButtonIconName="ios-arrow-back"
          leftButtonOnPress={navigator.popToTop}
          rightButtonText="Directions"
          rightButtonOnPress={this.openMap}
        />
        <ScrollView>
          <MapView initialRegion={mapRegion} style={styles.map}>
            <MapView.Marker
              coordinate={mapRegion}
              description="2700 Mission College Blvd, Santa Clara, CA 95054"
              onCalloutPress={this.openMap}
              ref={r => {
                this._marker = r;
              }}
              title="Santa Clara Marriott"
            />
          </MapView>

          <View style={{ flex: 1 }}>
            <View style={styles.hero}>
              <Text style={styles.heroText}>
                The conference will be taking place on March 13th and 14th, with talks from 10am to 6pm each day. Plan to hang out with us each evening for plenty of socializing over food and drink.
              </Text>
              <Text style={styles.heroText}>
                Proceeds from all ticket sales are being donated to Code2040.
              </Text>
              <TouchableOpacity onPress={this.toggleModal} activeOpacity={0.75}>
                <Text style={styles.heroLink}>
                  Code of Conduct
                </Text>
              </TouchableOpacity>
            </View>

            <ListTitle text="Organizers" />
            {organisers.map((organiser, idx) => {
              const onPress = () => {};

              return (
                <Organiser
                  avatar={organiser.avatar}
                  key={idx}
                  onPress={onPress}
                  name={organiser.name}
                  summary={organiser.summary}
                />
              );
            })}

            <View style={styles.madeby}>
              <TouchableOpacity
                onPress={this.openThinkmill}
                activeOpacity={0.75}
                style={styles.madebyLink}
              >
                <Image
                  source={require('./images/thinkmill-logo.png')}
                  style={{ width: 80, height: 80 }}
                />
                {/* <Text style={[styles.madebyText, styles.madebyTitle]}>Made by Thinkmill</Text> */}
              </TouchableOpacity>
              <Text style={styles.madebyText}>
                This app made with love in Sydney, Australia and open sourced by Thinkmill
              </Text>
              <TouchableOpacity
                onPress={this.openRepository}
                activeOpacity={0.75}
              >
                <Text style={styles.heroLink}>
                  View Source Code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {!!modalIsOpen && <CodeOfConduct onClose={this.toggleModal} />}
      </Scene>
    );
  }
}

export default EnhancedScene()(Info);

const styles = StyleSheet.create({
  map: {
    flex: 1,
    height: 200,
    maxHeight: 200,
  },
  // hero
  hero: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: theme.color.gray20,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderTopColor: theme.color.gray30,
    borderTopWidth: 1 / PixelRatio.get(),
    paddingHorizontal: theme.fontSize.default,
  },
  heroText: {
    paddingTop: theme.fontSize.xlarge,
    fontSize: theme.fontSize.default,
    fontWeight: '300',
    lineHeight: theme.fontSize.large,
    textAlign: 'center',
  },
  heroLink: {
    color: theme.color.blue,
    fontSize: theme.fontSize.default,
    fontWeight: '500',
    padding: theme.fontSize.large,
  },

  // made by thinkmill
  madeby: {
    alignItems: 'center',
    paddingHorizontal: theme.fontSize.default,
    paddingVertical: theme.fontSize.xlarge,
  },
  madebyLink: {
    alignItems: 'center',
  },
  madebyText: {
    fontSize: theme.fontSize.default,
    fontWeight: '300',
    lineHeight: theme.fontSize.large,
    marginTop: theme.fontSize.default,
    textAlign: 'center',
  },
  madebyTitle: {
    fontWeight: '500',
  },
});
