import React, { Component, PropTypes } from 'react';
import {
	Image,
	LayoutAnimation,
	ListView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import moment from 'moment';

import SplashScreen from 'react-native-smart-splash-screen';

import { TIME_FORMAT } from '../../constants';
import talks, { getNextTalkFromId, getPrevTalkFromId } from '../../data/talks';
import Navbar from '../../components/Navbar';
import ListTitle from '../../components/ListTitle';
import Scene from '../../components/Scene';

import theme from '../../theme';
import { bindMethods } from '../../utils';

import Break from './components/Break';
import NowButton from './components/NowButton';
import Talk, { TalkSeparator } from './components/Talk';

function elementIsInView ({ viewTop, viewBottom, elementTop, elementBottom }, fullyInView = true) {
	if (fullyInView) {
		return ((viewTop < elementTop) && (viewBottom > elementBottom));
	} else {
		return ((elementTop <= viewBottom) && (elementBottom >= viewTop));
	}
}

export default class Schedule extends Component {
	constructor (props) {
		super(props);

		bindMethods.call(this, [
			'getActiveTalkLayout',
			'gotoEventInfo',
			'handleScroll',
			'scrolltoActiveTalk',
		]);

		const dataBlob = {};
		const sectionIDs = [];
		const rowIDs = [];
		let sectionIndex = 0;

		props.talks.forEach((talk) => {
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
			getRowData: (dataBlob, sectionID, rowID) => dataBlob[sectionID + ':' + rowID],
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		});

		this.state = {
			dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
		};
	}

	componentDidMount () {
		SplashScreen.close({});
	}

	gotoEventInfo () {
		this.props.navigator.push({
			scene: 'Info',
			transitionKey: 'FloatFromBottom',
		});
	}
	handleScroll ({ scrollY, viewHeight }) {
		const { activeTalk } = this.state;


		// TODO all talks are over. Discuss how to handle
		if (!activeTalk) return;

		const showNowButton = !elementIsInView({
			viewTop: scrollY,
			viewBottom: scrollY + viewHeight,
			elementTop: activeTalk.position,
			elementBottom: activeTalk.position + activeTalk.height,
		});

		this.toggleNowButton(showNowButton);
	}
	scrolltoActiveTalk () {
		const { activeTalk } = this.state;

		this.refs.listview.scrollTo({ x: 0, y: activeTalk.position, animated: true });

		// HACK scrollTo doesn't have a completion callback
		// See GitHub issue #11657 https://github.com/facebook/react-native/issues/11657

		const approximateScrollDuration = 360;
		setTimeout(() => this.setState({
			showNowButton: false,
		}), approximateScrollDuration);
	}
	toggleNowButton (showNowButton) {
		LayoutAnimation.easeInEaseOut();
		this.setState({ showNowButton });
	}
	getActiveTalkLayout ({ height, position }) {
		this.setState({
			activeTalk: { height, position },
		});
	}
	render () {
		const { navigator, talks } = this.props;
		const { dataSource, showNowButton } = this.state;

		const renderFooter = () => (
			<TouchableOpacity onPress={this.gotoEventInfo} activeOpacity={0.75}>
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
				<Navbar
					title="Schedule"
					rightButtonText="Event Info"
					rightButtonOnPress={this.gotoEventInfo}
				/>

				<ListView
					dataSource={dataSource}
					ref="listview"
					initialListSize={initialListSize}
					onScroll={({ nativeEvent: { contentOffset, layoutMeasurement } }) => this.handleScroll({
						viewHeight: layoutMeasurement.height,
						scrollY: contentOffset.y,
					})}
					scrollEventThrottle={300}
					enableEmptySections
					renderSeparator={(sectionID, rowID) => {
						const key = sectionID + ':' + rowID;
						const talk = dataSource._dataBlob[key];
						const status = getTalkStatus(talk.time.start, talk.time.end);

						return <TalkSeparator key={key} status={status} />;
					}}
					renderRow={(talk) => {
						const status = getTalkStatus(talk.time.start, talk.time.end);

						if (talk.break) {
							return (
								<Break
									endTime={moment(talk.time.end).format(TIME_FORMAT)}
									startTime={moment(talk.time.start).format(TIME_FORMAT)}
									status={status}
								/>
							);
						}

						// methods on Talk
						const onPress = () => navigator.push({
							enableSwipeToPop: true,
							scene: 'Talk',
							props: {
								introduceUI: true,
								nextTalk: getNextTalkFromId(talk.id),
								prevTalk: getPrevTalkFromId(talk.id),
								talk,
							},
						});

						const onLayout = status === 'present'
							? ({ nativeEvent: { layout } }) => this.getActiveTalkLayout({
								height: layout.height,
								position: layout.y - theme.listheader.height,
							})
							: null;

						return (
							<Talk
								onPress={onPress}
								speakerName={talk.speaker.name}
								speakerAvatarUri={talk.speaker.avatar}
								startTime={moment(talk.time.start).format(TIME_FORMAT)}
								status={status}
								onLayout={onLayout}
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

				{!!showNowButton && (
					<NowButton onPress={this.scrolltoActiveTalk} />
				)}
			</Scene>
		);
	}
};

Schedule.propTypes = {
	navigator: PropTypes.object.isRequired,
	talks: PropTypes.array.isRequired,
};
Schedule.defaultProps = {
	talks: talks,
};

const styles = StyleSheet.create({
	link: {
		color: theme.color.blue,
		fontSize: theme.fontSize.default,
		fontWeight: '500',
		paddingVertical: theme.fontSize.large,
		marginBottom: 34 * 2,
		textAlign: 'center',
	},
});

function getTalkStatus (startTime, endTime) {
	const now = moment();

	if (now.isBetween(startTime, endTime)) {
		return 'present';
	} else if (now.isBefore(startTime)) {
		return 'future';
	}

	return 'past';
};
