// @flow
import React, { Component } from 'react';
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
  View,
} from 'react-native';
import moment from 'moment-timezone';

import type { ScheduleTalk, Speaker as SpeakerType } from '../../../../types';

import { TIME_FORMAT } from '../../../../constants';
import { darken } from '../../../../utils/color';
import { attemptToOpenUrl } from '../../../../utils';

import theme from '../../../../theme';
import Avatar from '../../../../components/Avatar';

import Preview from '../Preview';

const isAndroid = Platform.OS === 'android';

const Speaker = ({ speaker, onPress }) => {
  const touchableProps = {
    activeOpacity: 0.66,
    onPress,
  };

  return (
    <TouchableOpacity {...touchableProps}>
      <View style={styles.heroSpeaker}>
        <Avatar source={speaker.avatar} />
        <Text style={styles.heroSpeakerName}>
          {speaker.name}
        </Text>
        <Text style={styles.heroSpeakerHint}>
          (tap for more)
        </Text>
      </View>
    </TouchableOpacity>
  );
};

type Props = {
  nextTalk?: ScheduleTalk | null,
  nextTalkPreviewIsEngaged: boolean,
  onHeroLayout?: (Object) => mixed,
  onPressNext?: (Object) => mixed,
  onScroll?: ((Object) => mixed) | null,
  onScrollEndDrag?: () => mixed,
  prevTalk?: ScheduleTalk | null,
  prevTalkPreviewIsEngaged: boolean,
  showSpeakerModal: (SpeakerType) => mixed,
  visibleTalk: ScheduleTalk,
};

const TalkPreview = ({ talk, isEngaged }) => {
  const speakers = talk.speakers.map(speaker => speaker.name).join(', ');

  const subtitle = `${moment
    .tz(talk.time.start, 'America/Los_Angeles')
    .format(TIME_FORMAT)} - ${speakers}`;

  return (
    <Preview
      isActive={isEngaged}
      position="bottom"
      subtitle={subtitle}
      title={talk.title}
    />
  );
};

class TalkPreviewPrev extends React.Component {
  props: {
    talk: ScheduleTalk,
    isEngaged: boolean,
  };

  render() {
    let { talk, isEngaged } = this.props;
    let preview = <TalkPreview talk={talk} isEngaged={isEngaged} />;

    if (isAndroid) {
      return null;
    } else {
      return (
        <View ref="prevTalkPreview" style={{ opacity: 0 }}>
          {preview}
        </View>
      );
    }
  }
}

class TalkPreviewNext extends React.Component {
  props: {
    talk: ScheduleTalk,
    isEngaged: boolean,
    onPress: Function,
  };

  render() {
    let { talk, isEngaged, onPress } = this.props;
    let preview = <TalkPreview talk={talk} isEngaged={isEngaged} />;

    if (isAndroid) {
      return (
        <Animated.View style={{ opacity: 0 }}>
          <TouchableHighlight
            underlayColor={darken(theme.color.sceneBg, 10)}
            onPress={onPress}
          >
            <View>
              {preview}
            </View>
          </TouchableHighlight>
        </Animated.View>
      );
    } else {
      return (
        <View ref="nextTalkPreview" style={{ opacity: 0 }}>
          {preview}
        </View>
      );
    }
  }
}

export default class TalkPane extends Component {
  props: Props;

  state = {
    animValue: new Animated.Value(0),
  };

  static defaultProps = {
    nextTalkPreviewIsEngaged: false,
    prevTalkPreviewIsEngaged: false,
  };

  componentDidMount() {
    if (isAndroid) {
      this.fadeInAndroidNextButton();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const nextTalk = this.props.nextTalk;
    const isNewTalk = (nextTalk && nextTalk.id) !== (nextTalk && nextTalk.id);
    if (isAndroid && isNewTalk) {
      this.fadeInAndroidNextButton();
    }
  }

  fadeInAndroidNextButton = () => {
    this.state.animValue.setValue(0);
    Animated.timing(this.state.animValue, {
      toValue: 1,
      duration: 300,
    }).start();
  };

  openVideo(url) {
    attemptToOpenUrl(url);
  }

  render() {
    const {
      nextTalk,
      nextTalkPreviewIsEngaged,
      onHeroLayout,
      onPressNext,
      prevTalk,
      prevTalkPreviewIsEngaged,
      showSpeakerModal,
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

    const videoUrl = 'https://youtu.be/' +
      visibleTalk.videoId +
      '?list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0';

    return (
      <ScrollView
        style={{ flex: 1 }}
        scrollEventThrottle={90}
        ref="scrollview"
        {...props}
      >
        <View style={scrollAreaStyle}>
          {prevTalk &&
            <TalkPreviewPrev
              talk={prevTalk}
              isEngaged={prevTalkPreviewIsEngaged}
            />}

          <View style={styles.hero} onLayout={onHeroLayout}>
            {speakers}

            <Text style={styles.heroTitle}>
              {visibleTalk.title}
            </Text>
            {visibleTalk.videoId &&
              <TouchableOpacity
                onPress={() => this.openVideo(videoUrl)}
                style={styles.heroLink}
              >
                <Text style={styles.heroLinkText}>Watch video</Text>
              </TouchableOpacity>}
          </View>

          <View style={summaryStyles} ref="summary">
            <Text style={styles.summaryText}>
              {visibleTalk.summary}
            </Text>
          </View>

          {nextTalk &&
            <TalkPreviewNext
              talk={nextTalk}
              isEngaged={nextTalkPreviewIsEngaged}
              onPress={onPressNext}
            />}
        </View>

      </ScrollView>
    );
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
    paddingTop: theme.fontSize.xlarge,
  },
  heroSpeaker: {
    alignItems: 'center',
    paddingHorizontal: theme.fontSize.xlarge,
  },
  heroSpeakerHint: {
    color: theme.color.gray40,
    fontSize: theme.fontSize.xsmall,
    paddingBottom: theme.fontSize.large,
  },
  heroSpeakerName: {
    color: theme.color.blue,
    fontSize: theme.fontSize.default,
    fontWeight: '500',
    marginTop: theme.fontSize.small,
  },
  heroTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: '300',
    textAlign: 'center',
  },
  heroLink: {
    marginTop: 10,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: theme.color.blue,
  },
  heroLinkText: {
    color: theme.color.blue,
  },
  summaryAndroid: {
    flex: 2,
  },
  summaryIos: {
    paddingBottom: 60,
  },
  summaryText: {
    fontSize: theme.fontSize.default,
    fontWeight: '300',
    lineHeight: theme.fontSize.large,
    padding: theme.fontSize.large,
  },
  scrollAreaIos: {},
  scrollAreaAndroid: {
    flex: 2,
    minHeight: theme.talkPaneAndroidMinScrollAreaHeight,
  },
});
