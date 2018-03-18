//
import React, { PureComponent } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Share,
  BackAndroid
} from "react-native";
import PropTypes from "prop-types";
import moment from "moment-timezone";

import BackButtonAndroid from "../../components/BackButtonAndroid";
import { TIME_FORMAT } from "../../constants";
import Navbar from "../../components/Navbar";
import Scene from "../../components/Scene";

import theme from "../../theme";
import talks, {
  getNextTalkFromIndex,
  getPreviousTalkFromIndex
} from "../../data/talks";

import Hint from "./components/Hint";
import Speaker from "./components/Speaker";
import TalkPane from "./components/Pane";

class Talk extends PureComponent {
  state = {
    animValue: new Animated.Value(0),
    showIntro: true,
    modalIsOpen: false,
    talkIndex: this.props.navigation.state.params.talkIndex
  };

  sceneHeight = Dimensions.get("window").height;
  sceneWidth = Dimensions.get("window").width;

  handleLayout({ height }) {
    const availableHeight = this.sceneHeight - height;

    this.talkpane.refs.summary.measure((left, top, width, height) => {
      if (availableHeight > height) {
        this.talkpane.refs.summary.setNativeProps({
          style: { minHeight: availableHeight - theme.nextup.height }
        });
      }
    });
  }

  handleScroll = ({ nativeEvent }) => {
    const contentHeight = nativeEvent.contentSize.height;
    const viewHeight = nativeEvent.layoutMeasurement.height;
    const scrollY = nativeEvent.contentOffset.y;
    const heightOffset =
      contentHeight > viewHeight ? contentHeight - viewHeight : 0;
    const { nextTalkPreview, prevTalkPreview, scrollview } = this.talkpane.refs;
    const { talkIndex } = this.state;

    if (scrollY > 0 && nextTalkPreview) {
      const opacity = Math.min((scrollY - (heightOffset + 20)) / 100, 1);
      nextTalkPreview.setNativeProps({ style: { opacity } });
    } else if (prevTalkPreview) {
      const opacity = Math.min(Math.abs(scrollY + 20) / 100, 1);
      prevTalkPreview.setNativeProps({ style: { opacity } });
    }

    const jumpToNext =
      getNextTalkFromIndex(this.state.talkIndex) &&
      scrollY > heightOffset + 110;
    const jumpToPrev =
      getPreviousTalkFromIndex(this.state.talkIndex) && scrollY < -110;

    if (jumpToNext) {
      scrollview.setNativeProps({
        scrollEnabled: false,
        bounces: false
      });
      this.renderNextTalk();
    } else if (jumpToPrev) {
      scrollview.setNativeProps({
        bounces: false,
        scrollEnabled: false
      });
      this.renderPrevTalk();
    }
  };

  renderNextTalk = () => {
    const { talkIndex } = this.state;
    const nextTalk = getNextTalkFromIndex(talkIndex);

    this.setTalks({ talk: nextTalk, talkIndex: talkIndex + 1 }, "next");
  };

  renderPrevTalk = () => {
    const { talkIndex } = this.state;
    const prevTalk = getPreviousTalkFromIndex(talkIndex);

    this.setTalks({ talk: prevTalk, talkIndex: talkIndex - 1 }, "prev");
  };

  setTalks = (newState, transitionDirection) => {
    this.setState(
      {
        incomingTalk: newState.talk,
        transitionDirection
      },
      () => {
        Animated.spring(this.state.animValue, {
          toValue: 1,
          friction: 7,
          tension: 30
        }).start(() => {
          this.setState(Object.assign({}, newState), () => {
            this.state.animValue.setValue(0);
            this.talkpane.refs.scrollview.setNativeProps({
              bounces: true,
              scrollEnabled: true
            });
            this.talkpane.refs.scrollview.scrollTo({ y: 0, animated: false });
          });
        });
      }
    );
  };

  share = () => {
    const talk = this.getTalk();
    let speakerHandles = "";

    if (talk && talk.speakers) {
      const speakers = talk.speakers;

      let speakerHandles = speakers
        .map(speaker => speaker.twitter || speaker.name)
        .join(", ");
      speakerHandles += " - ";
    }

    Share.share({
      title: "NeosCon 2017",
      message: `${speakerHandles || ""}"${talk.title}" #neoscon`
    });
  };

  toggleSpeakerModal = data => {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen,
      modalSpeaker: data
    });
  };

  getTalk() {
    return talks[this.state.talkIndex];
  }

  render() {
    const { navigator } = this.props;
    const {
      animValue,
      modalIsOpen,
      modalSpeaker,
      incomingTalk,
      showIntro,
      talkIndex
    } = this.state;
    const talk = this.getTalk();
    const prevTalk = getPreviousTalkFromIndex(talkIndex);
    const nextTalk = getNextTalkFromIndex(talkIndex);

    const isAndroid = Platform.OS === "android";
    const headerTitle = moment
      .tz(talk.time.start, "Europe/Berlin")
      .format(TIME_FORMAT);
    const availableHeight = this.sceneHeight - theme.navbar.height;

    const incomingFrom =
      this.state.transitionDirection === "next"
        ? this.sceneHeight
        : -this.sceneHeight;
    const outgoingTo =
      this.state.transitionDirection === "next"
        ? -this.sceneHeight
        : this.sceneHeight;

    const transitionStyles = {
      height: availableHeight,
      position: "absolute",
      top: theme.navbar.height,
      width: this.sceneWidth
    };
    const incomingTransitionStyles = {
      transform: [
        {
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [incomingFrom, 0]
          })
        }
      ]
    };
    const outgoingTransitionStyles = {
      transform: [
        {
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, outgoingTo]
          })
        }
      ]
    };

    return (
      <Scene>
        <Animated.View style={[transitionStyles, outgoingTransitionStyles]}>
          <TalkPane
            nextTalk={nextTalk}
            onHeroLayout={({ nativeEvent: { layout } }) =>
              this.handleLayout(layout)
            }
            onScroll={!isAndroid ? this.handleScroll : null}
            onPressNext={this.renderNextTalk}
            prevTalk={prevTalk}
            ref={r => (this.talkpane = r)}
            showSpeakerModal={this.toggleSpeakerModal}
            visibleTalk={talk}
          />
        </Animated.View>
        {!!incomingTalk && (
          <Animated.View
            style={[transitionStyles, incomingTransitionStyles]}
            pointerEvents="none"
          >
            <TalkPane
              showSpeakerModal={this.toggleSpeakerModal}
              visibleTalk={incomingTalk}
              ref={r => (this.transitionpane = r)}
            />
          </Animated.View>
        )}
        {!isAndroid &&
          showIntro && (
            <Hint
              onClose={() =>
                this.setState({
                  showIntro: false
                })
              }
            />
          )}
        {modalIsOpen &&
          modalSpeaker && (
            <Speaker
              avatar={modalSpeaker.avatar}
              github={modalSpeaker.github}
              name={modalSpeaker.name}
              onClose={this.toggleSpeakerModal}
              summary={modalSpeaker.summary}
              twitter={modalSpeaker.twitter}
            />
          )}
        {/* navbar must be rendered after the talk panes for visibility */}
        <Navbar
          title={headerTitle}
          leftButtonIconName={isAndroid ? "md-arrow-back" : "ios-arrow-back"}
          leftButtonOnPress={() => this.props.navigation.goBack()}
          rightButtonIconName={isAndroid ? "md-share-alt" : null}
          rightButtonText={!isAndroid ? "Share" : null}
          rightButtonOnPress={this.share}
        />
      </Scene>
    );
  }
}

export default BackButtonAndroid()(Talk);
