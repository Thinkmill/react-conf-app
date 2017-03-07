// @flow
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  ListView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';

import type { ScheduleTalk } from '../../types';

import Splash from 'react-native-smart-splash-screen';

import { TIME_FORMAT } from '../../constants';
import talks, {
  getIndexFromId,
  getNextTalkFromId,
  getPrevTalkFromId,
} from '../../data/talks';
import Navbar from '../../components/Navbar';
import ListTitle from '../../components/ListTitle';
import Scene from '../../components/Scene';

import theme from '../../theme';

import Break from './components/Break';
import NowButton from './components/NowButton';
import Talk, { TalkSeparator } from './components/Talk';
import SplashScreen from './components/SplashScreen';

type Props = {
  navigator: Object,
  talks: Array<ScheduleTalk>,
};

type State = {
  dataSource: Object,
  scrollY: Animated.Value,
  showNowButton?: boolean,
  activeTalkLayout?: {
    height: number,
    position: number,
  },
};

type VisibleRows = {
  [sectionID: string]: {
    [rowID: string]: true,
  },
};

type ChangedRows = {
  [sectionID: string]: {
    [rowID: string]: true | false,
  },
};

export default class Schedule extends Component {
  props: Props;
  state: State;
  scrollYListener: string;
  _navigatorWillFocusSubscription: Object;

  static defaultProps = {
    talks: talks,
  };

  constructor(props: Props) {
    super(props);

    const dataBlob = {};
    const sectionIDs = [];
    const rowIDs = [];
    let sectionIndex = 0;

    props.talks.forEach(talk => {
      const sID = moment(talk.time.start).format('dddd');

      // create new section and initialize empty array for section index
      if (!dataBlob[sID]) {
        sectionIDs.push(sID);
        rowIDs[sectionIndex] = [];
        sectionIndex++;
        dataBlob[sID] = sID;
      }

      rowIDs[rowIDs.length - 1].push(talk.id);
      dataBlob[sID + ':' + talk.id] = talk;
    });

    const ds = new ListView.DataSource({
      getSectionData: (dataBlob, sectionID) => dataBlob[sectionID],
      getRowData: (dataBlob, sectionID, rowID) =>
        dataBlob[sectionID + ':' + rowID],
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
      scrollY: new Animated.Value(0),
    };

    this.scrollYListener = this.state.scrollY.addListener(({ value }) => {
      if (value > 120) {
        StatusBar.setBarStyle('default', true);
        StatusBar.setHidden(false, true);
      } else if (value < 80) {
        StatusBar.setBarStyle('light-content', true);
        StatusBar.setHidden(false, true);
      } else {
        StatusBar.setHidden(true, true);
      }
    });
  }
  componentDidMount() {
    this._navigatorWillFocusSubscription = this.props.navigator.navigationContext.addListener(
      'willfocus',
      this.handleNavigatorWillFocus
    );

    // This is the actual image splash screen, not the animated one.
    if (Splash) {
      Splash.close({
        animationType: Splash.animationType.fade,
        duration: 300,
        delay: 200,
      });
    }
  }
  componentWillUnmount() {
    this.state.scrollY.removeListener(this.scrollYListener);
    this._navigatorWillFocusSubscription.remove();
  }

  handleNavigatorWillFocus = (event: any) => {
    const { scene } = event.data.route;

    if (scene === 'Schedule' && this.state.scrollY._value < 120) {
      StatusBar.setBarStyle('light-content', true);
    }
  };
  gotoEventInfo = () => {
    StatusBar.setBarStyle('default', true);
    this.props.navigator.push({
      enableSwipeToPop: true,
      scene: 'Info',
    });
  };
  onChangeVisibleRows = (
    visibleRows: VisibleRows,
    changedRows: ChangedRows
  ) => {
    // Now button
    const now = moment();
    const currentTalk = this.props.talks.find(talk => {
      const start = moment(talk.time.start);
      const end = moment(talk.time.end);
      return now.isBetween(start, end);
    });

    // TODO all talks are over. Discuss how to handle
    if (!currentTalk) return;

    const day = moment(currentTalk.time.start).format('dddd');
    const talksForToday = visibleRows[day];

    // Set the now button to visible based on whether the talk is visible or not.
    this.toggleNowButton(!(talksForToday && talksForToday[currentTalk.id]));
  };
  scrolltoActiveTalk = () => {
    const { activeTalkLayout } = this.state;
    if (!activeTalkLayout) return;
    const { contentLength } = this.refs.listview.scrollProperties;
    const sceneHeight = Dimensions.get('window').height;
    const maxScroll = contentLength - (sceneHeight + theme.navbar.height);
    const scrollToY = maxScroll < activeTalkLayout.position
      ? maxScroll
      : activeTalkLayout.position;

    this.refs.listview.scrollTo({ y: scrollToY, animated: true });
  };
  toggleNowButton(showNowButton: boolean) {
    LayoutAnimation.easeInEaseOut();
    this.setState({ showNowButton });
  }
  render() {
    const { navigator, talks } = this.props;
    const { dataSource, scrollY, showNowButton } = this.state;

    const navbarTop = scrollY.interpolate({
      inputRange: [80, 120],
      outputRange: [-64, 0],
      extrapolate: 'clamp',
    });

    const splashTop = scrollY.interpolate({
      inputRange: [-200, 400],
      outputRange: [200, -400],
      extrapolate: 'clamp',
    });

    const renderFooter = () => (
      <TouchableOpacity
        key="footer"
        onPress={this.gotoEventInfo}
        activeOpacity={0.75}
      >
        <Text style={styles.link}>
          Event Info
        </Text>
      </TouchableOpacity>
    );

    // we need the "active talk" to be rendered to get its scroll position
    // also, there's so few items it's not a perf concern
    const initialListSize = talks.length;

    return (
      <Scene>
        <SplashScreen
          onLogoPress={this.gotoEventInfo}
          style={{ top: splashTop }}
        />

        <Animated.View style={[styles.navbar, { top: navbarTop }]}>
          <Navbar
            title="Schedule"
            rightButtonText="About"
            rightButtonOnPress={this.gotoEventInfo}
          />
        </Animated.View>

        {/* Spacer for the headings to stick correctly */}
        <View style={styles.spacer} />

        <ListView
          dataSource={dataSource}
          ref="listview"
          initialListSize={initialListSize}
          onScroll={Animated.event([
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true },
          ])}
          scrollEventThrottle={1}
          onChangeVisibleRows={this.onChangeVisibleRows}
          enableEmptySections
          removeClippedSubviews={false}
          renderHeader={() => <View key="spacer" style={{ height: 190 }} />}
          renderSeparator={(sectionID, rowID) => {
            const key = sectionID + ':' + rowID;
            const talk = dataSource._dataBlob[key];
            const status = getTalkStatus(talk.time.start, talk.time.end);

            return <TalkSeparator key={key} status={status} />;
          }}
          renderRow={talk => {
            const status = getTalkStatus(talk.time.start, talk.time.end);
            const onLayout = status === 'present'
              ? ({ nativeEvent: { layout } }) => {
                  this.setState({
                    activeTalkLayout: {
                      height: layout.height,
                      position: layout.y - theme.navbar.height / 2,
                    },
                  });
                }
              : null;

            if (talk.break) {
              return (
                <Break
                  endTime={moment(talk.time.end).format(TIME_FORMAT)}
                  lightning={talk.lightning}
                  onLayout={onLayout}
                  startTime={moment(talk.time.start).format(TIME_FORMAT)}
                  status={status}
                  title={talk.title}
                />
              );
            }

            // methods on Talk
            const onPress = () => {
              let talkIdx = getIndexFromId(talk.id);
              StatusBar.setBarStyle('default', true);
              navigator.push({
                enableSwipeToPop: true,
                scene: 'Talk',
                props: {
                  introduceUI: talkIdx && talkIdx < talks.length - 1,
                  nextTalk: getNextTalkFromId(talk.id),
                  prevTalk: getPrevTalkFromId(talk.id),
                  talk,
                },
              });
            };

            return (
              <Talk
                keynote={talk.keynote}
                lightning={talk.lightning}
                onLayout={onLayout}
                onPress={onPress}
                speaker={talk.speaker}
                startTime={moment(talk.time.start).format(TIME_FORMAT)}
                status={status}
                title={talk.title}
              />
            );
          }}
          renderSectionHeader={(sectionData, sectionID) => (
            <ListTitle
              bordered={!!dataSource.sectionIdentities.indexOf(sectionID)}
              text={sectionData}
            />
          )}
          renderFooter={renderFooter}
        />

        {showNowButton && <NowButton onPress={this.scrolltoActiveTalk} />}
      </Scene>
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 2,
  },
  spacer: {
    backgroundColor: 'transparent',
    height: theme.navbar.height,
    zIndex: 1,
  },
  link: {
    color: theme.color.blue,
    fontSize: theme.fontSize.default,
    fontWeight: '500',
    paddingVertical: theme.fontSize.large,
    marginBottom: 34 * 2,
    textAlign: 'center',
  },
});

function getTalkStatus(startTime, endTime) {
  const now = moment();

  if (now.isBetween(startTime, endTime)) {
    return 'present';
  } else if (now.isBefore(startTime)) {
    return 'future';
  }

  return 'past';
}
