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

import type { ScheduleTalk, SpeakerType } from '../../../../types';

import { TIME_FORMAT } from '../../../../constants';
import { darken } from '../../../../utils/color';
import theme from '../../../../theme';
import Avatar from '../../../../components/Avatar';

import Preview from '../Preview';

function Speaker({ data, onPress }) {
  const touchableProps = {
    activeOpacity: 0.66,
    onPress,
  };

  return (
    <TouchableOpacity {...touchableProps}>
      <View style={styles.heroSpeaker}>
        <Avatar source={data.avatar} />
        <Text style={styles.heroSpeakerName}>
          {data.name}
        </Text>
        <Text style={styles.heroSpeakerHint}>
          (tap for more)
        </Text>
      </View>
    </TouchableOpacity>
  );
}

type Props = {
  nextTalk?: ScheduleTalk,
  nextTalkPreviewIsEngaged?: boolean,
  onHeroLayout?: (Object) => mixed,
  onPressNext?: (Object) => mixed,
  onScroll?: (Object) => mixed,
  onScrollEndDrag?: () => mixed,
  prevTalk?: ScheduleTalk,
  prevTalkPreviewIsEngaged?: boolean,
  showSpeakerModal: (SpeakerType | Array<SpeakerType>) => mixed,
  visibleTalk: ScheduleTalk,
};

export default class TalkPane extends Component {
  props: Props;
  state = {
    animValue: new Animated.Value(0),
  };

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.fadeInAdroidNextButton();
    }
  }
  componentWillReceiveProps(nextProps: Props) {
    const isAndroid = Platform.OS === 'android';
    const isNewTalk = (this.props.nextTalk && this.props.nextTalk.id) !==
      (nextProps.nextTalk && nextProps.nextTalk.id);
    if (isAndroid && isNewTalk) {
      this.fadeInAdroidNextButton();
    }
  }
  fadeInAdroidNextButton = () => {
    this.state.animValue.setValue(0);
    Animated.timing(this.state.animValue, {
      toValue: 1,
      duration: 300,
    }).start();
  };

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

    const isAndroid = Platform.OS === 'android';

    const speakers = Array.isArray(visibleTalk.speaker)
      ? visibleTalk.speaker.map(s => (
          <Speaker key={s.name} data={s} onPress={() => showSpeakerModal(s)} />
        ))
      : <Speaker
          data={visibleTalk.speaker}
          onPress={() => showSpeakerModal(visibleTalk.speaker)}
        />;

    let nextPreviewUI = null;

    if (nextTalk && nextTalk.speaker) {
      let subtitle;
      if (!Array.isArray(nextTalk.speaker)) {
        const speaker = nextTalk.speaker; // Tell flow that we definitely aren't changing speaker when we call moment().
        subtitle = `${moment
          .tz(nextTalk.time.start, 'America/Los_Angeles')
          .format(TIME_FORMAT)} - ${speaker.name}`;
      } else {
        const speakers = nextTalk.speaker
          .map(speaker => speaker.name)
          .join(', ');
        subtitle = `${moment
          .tz(nextTalk.time.start, 'America/Los_Angeles')
          .format(TIME_FORMAT)} - ${speakers}`;
      }

      if (isAndroid) {
        nextPreviewUI = (
          <Animated.View style={{ opacity: this.state.animValue }}>
            <TouchableHighlight
              underlayColor={darken(theme.color.sceneBg, 10)}
              onPress={onPressNext}
            >
              <View>
                <Preview
                  isActive={nextTalkPreviewIsEngaged}
                  position="bottom"
                  subtitle={subtitle}
                  title={nextTalk.title}
                />
              </View>
            </TouchableHighlight>
          </Animated.View>
        );
      } else {
        nextPreviewUI = (
          <View ref="nextTalkPreview" style={{ opacity: 0 }}>
            <Preview
              isActive={nextTalkPreviewIsEngaged}
              position="bottom"
              subtitle={subtitle}
              title={nextTalk.title}
            />
          </View>
        );
      }
    }

    const summaryStyles = isAndroid ? styles.summaryAndroid : styles.summaryIos;
    const scrollAreaStyle = isAndroid
      ? styles.scrollAreaAndroid
      : styles.scrollAreaIos;

    return (
      <ScrollView
        style={{ flex: 1 }}
        scrollEventThrottle={90}
        ref="scrollview"
        {...props}
      >
        <View style={scrollAreaStyle}>
          {!!prevTalk &&
            !isAndroid &&
            <View ref="prevTalkPreview" style={{ opacity: 0 }}>
              <Preview
                isActive={prevTalkPreviewIsEngaged}
                position="top"
                subtitle={
                  `${moment
                    .tz(prevTalk.time.start, 'America/Los_Angeles')
                    .format(
                      TIME_FORMAT
                    )} ${prevTalk.speaker.name ? ' - ' + prevTalk.speaker.name : ''}`
                }
                title={prevTalk.title}
              />
            </View>}
          <View style={styles.hero} onLayout={onHeroLayout}>
            {speakers}
            <Text style={styles.heroTitle}>
              {visibleTalk.title}
            </Text>
          </View>

          <View style={summaryStyles} ref="summary">
            <Text style={styles.summaryText}>
              {visibleTalk.summary}
            </Text>
          </View>

          {nextPreviewUI}
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
