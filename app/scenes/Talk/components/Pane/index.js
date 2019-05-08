//
import React, { Component, PureComponent } from 'react';
import {
  Animated,
  PixelRatio,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  View
} from 'react-native';
import StarRating from 'react-native-star-rating';

import Button from 'react-native-button';
import moment from 'moment-timezone';
import { connect } from 'react-redux';

import { TIME_FORMAT } from '../../../../constants';
import { darken } from '../../../../utils/color';
import { attemptToOpenUrl } from '../../../../utils';
import { selectors, actions } from '../../../../redux/index';

import theme from '../../../../theme';
import Avatar from '../../../../components/Avatar';

import Preview from '../Preview';

const isAndroid = Platform.OS === 'android';

const Speaker = ({ speaker, onPress }) => {
  const touchableProps = {
    activeOpacity: 0.66,
    onPress
  };

  return (
    <TouchableOpacity {...touchableProps}>
      <View style={styles.heroSpeaker}>
        <Avatar source={speaker.avatar} />
        <Text style={styles.heroSpeakerName}>{speaker.name}</Text>
        <Text style={styles.heroSpeakerHint}>(tap for more)</Text>
      </View>
    </TouchableOpacity>
  );
};

const TalkPreview = ({ talk, isEngaged }) => {
  const speakers = talk.speakers.map(speaker => speaker.name).join(', ');

  const subtitle = `${moment
    .tz(talk.time.start, 'Europe/Berlin')
    .format(TIME_FORMAT)} - ${speakers}`;

  return (
    <Preview
      isActive={isEngaged}
      position='bottom'
      subtitle={subtitle}
      title={talk.title}
    />
  );
};

const mapStateToProps = (state, props) => ({
  rating: selectors.ratingForTalk(props.talkTitle)(state)
});
class RateTalkButtonUnconnected extends PureComponent {
  render() {
    const { rating } = this.props;
    const starCount = rating ? rating.starCount : 0;

    return (
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          marginTop: 20
        }}
      >
        {starCount ? (
          <StarRating
            containerStyle={{
              marginTop: 15,
              marginRight: 10
            }}
            style={{
              width: 200
            }}
            disabled={true}
            maxStars={5}
            rating={starCount}
            starSize={20}
          />
        ) : null}
        <Button
          containerStyle={{
            flexGrow: 1,
            padding: 10,
            height: 45,
            overflow: 'hidden',
            borderRadius: 4,
            backgroundColor: theme.color.blue
          }}
          style={{ fontSize: 20, color: 'white' }}
          onPress={this.props.onPress}
        >
          {rating ? 'Change your rating!' : 'Rate this talk!'}
        </Button>
      </View>
    );
  }
}
const RateTalkButton = connect(mapStateToProps)(RateTalkButtonUnconnected);

export default class TalkPane extends Component {
  state = {
    animValue: new Animated.Value(0)
  };

  componentDidMount() {
    if (isAndroid) {
      this.fadeInAndroidNextButton();
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextTalk = this.props.nextTalk;
    if (isAndroid) {
      this.fadeInAndroidNextButton();
    }
  }

  fadeInAndroidNextButton = () => {
    this.state.animValue.setValue(0);
    Animated.timing(this.state.animValue, {
      toValue: 1,
      duration: 300
    }).start();
  };

  openVideo(url) {
    attemptToOpenUrl(url);
  }

  render() {
    const {
      onHeroLayout,
      onPressNext,
      showSpeakerModal,
      showTalkRatingModal,
      visibleTalk,
      ...props
    } = this.props;

    const speakers = visibleTalk.speakers.map(speaker => (
      <Speaker
        key={speaker.name}
        speaker={speaker}
        onPress={() => showSpeakerModal(speaker)}
      />
    ));

    const summaryStyles = isAndroid ? styles.summaryAndroid : styles.summaryIos;
    const scrollAreaStyle = isAndroid
      ? styles.scrollAreaAndroid
      : styles.scrollAreaIos;

    const videoUrl =
      'https://youtu.be/' +
      visibleTalk.videoId +
      '?list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0';

    return (
      <ScrollView
        style={{ flex: 1 }}
        scrollEventThrottle={90}
        ref='scrollview'
        {...props}
      >
        <View style={scrollAreaStyle}>
          <View style={styles.hero} onLayout={onHeroLayout}>
            {speakers}

            <Text style={styles.heroTitle}>{visibleTalk.title}</Text>
            <Text style={styles.heroRoom}>{visibleTalk.room}</Text>
            {this.renderRateTalk()}
            {visibleTalk.videoId && (
              <TouchableOpacity
                onPress={() => this.openVideo(videoUrl)}
                style={styles.heroLink}
              >
                <Text style={styles.heroLinkText}>Watch video</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={summaryStyles} ref='summary'>
            <Text style={styles.summaryText}>{visibleTalk.summary}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  renderRateTalk() {
    const { endTime, title, ratingEnabled } = this.props.visibleTalk;
    if (!endTime || !ratingEnabled) {
      return null;
    }
    if (endTime.isBefore(moment())) {
      return (
        <RateTalkButton
          talkTitle={title}
          onPress={this.props.showTalkRatingModal}
        />
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: theme.color.gray20,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderTopColor: theme.color.gray20,
    borderTopWidth: 1 / PixelRatio.get(),
    marginTop: -(1 / PixelRatio.get()),
    paddingHorizontal: theme.fontSize.large,
    paddingBottom: theme.fontSize.xlarge,
    paddingTop: theme.fontSize.xlarge
  },
  heroSpeaker: {
    alignItems: 'center',
    paddingHorizontal: theme.fontSize.xlarge
  },
  heroSpeakerHint: {
    color: theme.color.gray40,
    fontSize: theme.fontSize.xsmall,
    paddingBottom: theme.fontSize.large
  },
  heroSpeakerName: {
    color: theme.color.blue,
    fontSize: theme.fontSize.default,
    fontWeight: '500',
    marginTop: theme.fontSize.small
  },
  heroTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: '300',
    textAlign: 'center'
  },
  heroRoom: {
    marginTop: 10,
    //fontSize: theme.fontSize.large,
    //fontWeight: "300",
    textAlign: 'center'
  },
  heroLink: {
    marginTop: 10,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: theme.color.blue
  },
  heroLinkText: {
    color: theme.color.blue
  },
  summaryAndroid: {
    flex: 2,
    paddingBottom: 60
  },
  summaryIos: {
    paddingBottom: 60
  },
  summaryText: {
    fontSize: theme.fontSize.default,
    fontWeight: '300',
    lineHeight: theme.fontSize.large,
    padding: theme.fontSize.large
  },
  scrollAreaIos: {},
  scrollAreaAndroid: {
    flex: 2,
    minHeight: theme.talkPaneAndroidMinScrollAreaHeight
  }
});
