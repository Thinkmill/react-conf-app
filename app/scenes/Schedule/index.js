import React, { Component, PropTypes } from 'react';
import {
	Image,
	LayoutAnimation,
	ListView,
	PixelRatio,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import moment from 'moment';

import { TIME_FORMAT } from '../../constants';
import talks from '../../data/talks';
import Navbar from '../../components/Navbar';
import ListTitle from '../../components/ListTitle';
import Scene from '../../components/Scene';
import theme from '../../theme';

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

		this.getActiveTalkLayout = this.getActiveTalkLayout.bind(this);
		this.handleScroll = this.handleScroll.bind(this);

		const dataBlob = {};
		const sectionIDs = [];
		const rowIDs = [];
		let sectionIndex = 0;

		props.talks.forEach((talk, i) => {
				const sID = moment(talk.time.start).format('dddd')

				// create new section and initialize empty array for section index
				if (!dataBlob[sID]) {
					sectionIDs.push(sID);
					rowIDs[sectionIndex] = [];
					sectionIndex++
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
			<TouchableOpacity onPress={this.gotoEventInfo.bind(this)} activeOpacity={0.75}>
				<Text style={styles.link}>
					Event Info
				</Text>
			</TouchableOpacity>
		);

		const mergedRowIds = [].concat.apply([], dataSource.rowIdentities);

		// we need the "active talk" to be rendered to get its scroll position
		// also, there's so few items it's not a perf concern
		const initialListSize = talks.length;

		return (
			<Scene>
				<Navbar
					title="Schedule"
					titleRenderer={() => (
						<View style={{
							alignItems: 'center',
							flex: 4,
							justifyContent: 'center',
						}}>
							<Image
								source={require('./images/navbar-logo.png')}
								style={{ width: 100, height: 100 }}
							/>
						</View>
					)}
					rightButtonText="Event Info"
					rightButtonOnPress={this.gotoEventInfo.bind(this)}
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
					renderRow={(talk, sectionID, rowID) => {
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
							props: { talk },
						});

						const onLayout = status === 'present'
							? ({ nativeEvent: { layout } }) => this.getActiveTalkLayout({
								height: layout.height,
								position: layout.y - theme.listheader.height,
							})
							: null;

						return (
							<Talk
								endTime={talk.time.end.toString()}
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
					<NowButton onPress={this.scrolltoActiveTalk.bind(this)} />
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

// TODO refine this logic
function getTalkStatus (startTime, endTime) {
	const now = moment();
	const end = moment(endTime);
	const start = moment(startTime);

	const startTimeFromNow = now.diff(start, 'minutes');
	const endTimeFromNow = now.diff(end, 'minutes');
	const isPresent = (startTimeFromNow > 0) && (endTimeFromNow < 0);

	let status = startTimeFromNow > 0 ? 'past' : 'future';

	if (isPresent) status = 'present';

	return status;
};
