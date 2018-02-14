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

import BackButtonAndroid from '../../components/BackButtonAndroid';
import ListTitle from '../../components/ListTitle';
import Navbar from '../../components/Navbar';
import Scene from '../../components/Scene';

import { list as organiserList } from '../../data/organisers';
import theme from '../../theme';
import { attemptToOpenUrl } from '../../utils';

import CodeOfConduct from './components/CodeOfConduct';
import Organiser from './components/Organiser';

// Hamburg
const mapRegion = {
  latitude: 53.5562832,
  longitude: 9.9812613,
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
    const query = encodeURI('Hamburg, Dammtorwall 15');
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
    const { navigation, organisers } = this.props;
    const { modalIsOpen } = this.state;

    const isAndroid = Platform.OS === 'android';

    return (
      <Scene>
        <Navbar
          title="About"
          leftButtonIconName={isAndroid ? 'md-arrow-back' : 'ios-arrow-back'}
          leftButtonOnPress={() => { navigation.goBack() }}
          rightButtonIconName={isAndroid ? 'md-navigate' : null}
          rightButtonText={!isAndroid ? 'Directions' : null}
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
                The conference will be taking place on April 13th and April 14th.
              </Text>
              <Text style={styles.heroText}>
                On the evening of April 12th, there will be a warmup party.
                On April 14th, there will be a social event.
              </Text>
              <TouchableOpacity onPress={this.toggleModal} activeOpacity={0.75}>
                <Text style={styles.heroLink}>
                  Code of Conduct
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.madeby}>
              <TouchableOpacity
                onPress={this.openThinkmill}
                activeOpacity={0.75}
                style={styles.madebyLink}
              >
                <Image
                  source={require('./images/thinkmill-logo.png')}
                  style={{ width: 44, height: 44 }}
                />
                {/* <Text style={[styles.madebyText, styles.madebyTitle]}>Made by Thinkmill</Text> */}
              </TouchableOpacity>
              <Text style={styles.madebyText}>
                Made with love in Sydney, Australia, and open sourced by Thinkmill
              </Text>
              {/* <TouchableOpacity
                onPress={this.openRepository}
                activeOpacity={0.75}
              >
                <Text style={styles.heroLink}>
                  View Source Code
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </ScrollView>

        {!!modalIsOpen && <CodeOfConduct onClose={this.toggleModal} />}
      </Scene>
    );
  }
}

export default BackButtonAndroid()(Info);

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
    color: theme.color.gray60,
    fontSize: theme.fontSize.small,
    fontWeight: '300',
    lineHeight: 20,
    marginTop: theme.fontSize.default,
    textAlign: 'center',
  },
  madebyTitle: {
    fontWeight: '500',
  },
});
