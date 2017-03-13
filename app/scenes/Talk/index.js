// @flow
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  Share,
  BackAndroid,
} from 'react-native';
import moment from 'moment';

import type { ScheduleTalk, SpeakerType } from '../../types';
import BackButtonAndroid from '../../components/BackButtonAndroid';
import { TIME_FORMAT } from '../../constants';
import Navbar from '../../components/Navbar';
import Scene from '../../components/Scene';

import theme from '../../theme';
import { getNextTalkFromId, getPrevTalkFromId } from '../../data/talks';

import Hint from './components/Hint';
import Speaker from './components/Speaker';
import TalkPane from './components/Pane';

type Props = {
  navigator: Object,
  nextTalk?: ScheduleTalk,
  prevTalk?: ScheduleTalk,
  talk: ScheduleTalk,
  introduceUI: boolean,
};

type TransitionDirection = 'prev' | 'next';

type State = {
  animValue: Animated.Value,
  modalIsOpen: boolean,
  modalSpeaker?: SpeakerType,
  nextTalk?: ScheduleTalk,
  prevTalk?: ScheduleTalk,
  showIntro: boolean,
  talk: ScheduleTalk,
  incomingTalk?: ScheduleTalk,
  transitionDirection?: TransitionDirection,
};

type SetTalksState = {
  talk: ScheduleTalk,
  nextTalk?: ScheduleTalk,
  prevTalk?: ScheduleTalk,
};

class Talk extends Component {
  talkpane: $FlowFixMe; // https://github.com/facebook/flow/issues/2202
  transitionpane: $FlowFixMe; // https://github.com/facebook/flow/issues/2202

  props: Props;
  state: State = {
    animValue: new Animated.Value(0),
    modalIsOpen: false,
    nextTalk: this.props.nextTalk,
    prevTalk: this.props.prevTalk,
    showIntro: this.props.introduceUI,
    talk: this.props.talk,
  };
  sceneHeight = Dimensions.get('window').height;
  sceneWidth = Dimensions.get('window').width;

  handleLayout({ height }: { height: number }) {
    const availableHeight = this.sceneHeight - height;

    this.talkpane.refs.summary.measure((left, top, width, height) => {
      if (availableHeight > height) {
        this.talkpane.refs.summary.setNativeProps({
          style: { minHeight: availableHeight - theme.nextup.height },
        });
      }
    });
  }
  handleScroll = ({ nativeEvent }: Object) => {
    const contentHeight = nativeEvent.contentSize.height;
    const viewHeight = nativeEvent.layoutMeasurement.height;
    const scrollY = nativeEvent.contentOffset.y;
    const heightOffset = contentHeight > viewHeight
      ? contentHeight - viewHeight
      : 0;
    const { nextTalkPreview, prevTalkPreview, scrollview } = this.talkpane.refs;
    const { nextTalk, prevTalk } = this.state;

    if (scrollY > 0 && nextTalkPreview) {
      const opacity = Math.min((scrollY - (heightOffset + 20)) / 100, 1);
      nextTalkPreview.setNativeProps({ style: { opacity } });
    } else if (prevTalkPreview) {
      const opacity = Math.min(Math.abs(scrollY + 20) / 100, 1);
      prevTalkPreview.setNativeProps({ style: { opacity } });
    }

    const jumpToNext = nextTalk && scrollY > heightOffset + 110;
    const jumpToPrev = prevTalk && scrollY < -110;

    if (jumpToNext) {
      scrollview.setNativeProps({
        scrollEnabled: false,
        bounces: false,
      });
      this.renderNextTalk();
    } else if (jumpToPrev) {
      scrollview.setNativeProps({
        bounces: false,
        scrollEnabled: false,
      });
      this.renderPrevTalk();
    }
  };
  renderNextTalk = () => {
    const talk = this.state.nextTalk;
    const nextTalk = this.state.nextTalk
      ? getNextTalkFromId(this.state.nextTalk.id)
      : null;
    const prevTalk = this.state.talk;

    if (talk !== null) {
      this.setTalks({ nextTalk, prevTalk, talk }, 'next');
    }
  };
  renderPrevTalk = () => {
    const talk = this.state.prevTalk;
    const nextTalk = this.state.talk;
    const prevTalk = this.state.prevTalk
      ? getPrevTalkFromId(this.state.prevTalk.id)
      : null;

    if (talk !== null) {
      this.setTalks({ nextTalk, prevTalk, talk }, 'prev');
    }
  };
  setTalks = (
    newState: SetTalksState,
    transitionDirection: TransitionDirection
  ) => {
    this.setState(
      {
        incomingTalk: newState.talk,
        transitionDirection,
      },
      () => {
        Animated.spring(this.state.animValue, {
          toValue: 1,
          friction: 7,
          tension: 30,
        }).start(() => {
          this.setState(
            Object.assign({}, newState, { incomingTalk: null }),
            () => {
              this.state.animValue.setValue(0);
              this.talkpane.refs.scrollview.setNativeProps({
                bounces: true,
                scrollEnabled: true,
              });
              this.talkpane.refs.scrollview.scrollTo({ y: 0, animated: false });
            }
          );
        });
      }
    );
  };
  share = () => {
    const { talk } = this.state;
    const speakerHandle = talk.speaker.twitter
      ? '@' + talk.speaker.twitter
      : talk.speaker.name;

    Share.share({
      title: 'ReactConf 2017',
      message: `Loving ${speakerHandle}'s talk "${talk.title}" #ReactConf2017`,
    });
  };
  toggleSpeakerModal = (data: Object) => {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen,
      modalSpeaker: data,
    });
  };
  render() {
    const { navigator } = this.props;
    const {
      animValue,
      modalIsOpen,
      modalSpeaker,
      nextTalk,
      incomingTalk,
      prevTalk,
      showIntro,
      talk,
    } = this.state;

    const isAndroid = Platform.OS === 'android';
    const headerTitle = moment(talk.time.start).format(TIME_FORMAT);
    const availableHeight = this.sceneHeight - theme.navbar.height;

    const incomingFrom = this.state.transitionDirection === 'next'
      ? this.sceneHeight
      : -this.sceneHeight;
    const outgoingTo = this.state.transitionDirection === 'next'
      ? -this.sceneHeight
      : this.sceneHeight;

    const transitionStyles = {
      height: availableHeight,
      position: 'absolute',
      top: theme.navbar.height,
      width: this.sceneWidth,
    };
    const incomingTransitionStyles = {
      transform: [
        {
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [incomingFrom, 0],
          }),
        },
      ],
    };
    const outgoingTransitionStyles = {
      transform: [
        {
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, outgoingTo],
          }),
        },
      ],
    };

    // navbar must be rendered after the talk panes for visibility
    const navbar = (
      <Navbar
        title={headerTitle}
        leftButtonIconName={isAndroid ? 'md-arrow-back' : 'ios-arrow-back'}
        leftButtonOnPress={navigator.popToTop}
        rightButtonIconName={isAndroid ? 'md-share-alt' : null}
        rightButtonText={!isAndroid ? 'Share' : null}
        rightButtonOnPress={this.share}
      />
    );

    return (
      <Scene>
        <Animated.View style={[transitionStyles, outgoingTransitionStyles]}>
          <TalkPane
            nextTalk={nextTalk}
            onHeroLayout={({ nativeEvent: { layout } }) =>
              this.handleLayout(layout)}
            onScroll={!isAndroid ? this.handleScroll : null}
            onPressNext={this.renderNextTalk}
            prevTalk={prevTalk}
            ref={r => this.talkpane = r}
            showSpeakerModal={this.toggleSpeakerModal}
            visibleTalk={talk}
          />
        </Animated.View>
        {!!incomingTalk &&
          <Animated.View
            style={[transitionStyles, incomingTransitionStyles]}
            pointerEvents="none"
          >
            <TalkPane
              visibleTalk={incomingTalk}
              ref={r => this.transitionpane = r}
            />
          </Animated.View>}

        {!isAndroid &&
          showIntro &&
          <Hint onClose={() => this.setState({ showIntro: false })} />}

        {modalIsOpen &&
          modalSpeaker &&
          <Speaker
            avatar={modalSpeaker.avatar}
            github={modalSpeaker.github}
            name={modalSpeaker.name}
            onClose={this.toggleSpeakerModal}
            summary={modalSpeaker.summary}
            twitter={modalSpeaker.twitter}
          />}
        {navbar}
      </Scene>
    );
  }
}

export default BackButtonAndroid()(Talk);
