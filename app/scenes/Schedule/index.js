import React, { Component, PropTypes } from 'react';
import { ListView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';

import { TIME_FORMAT } from '../../constants';
import talkBlob from '../../data/talks';
import Navbar from '../../components/Navbar';
import ListTitle from '../../components/ListTitle';
import Scene from '../../components/Scene';
import theme from '../../theme';

import Talk from './components/Talk';

class Schedule extends Component {
	constructor (props) {
		super(props);

		const dataBlob = {};
		const sectionIDs = [];
		const rowIDs = [];
		let sectionIndex = 0;

		Object.keys(props.talks)
			.sort((a, b) => {
				const talkStartTime1 = moment(props.talks[a].time.start);
				const talkStartTime2 = moment(props.talks[b].time.start);

				return talkStartTime1.diff(talkStartTime2);
			})
			.map((k, i) => {
				const talk = props.talks[k];
				const sID = moment(talk.time.start).format('dddd')

				// create new section and initialize empty array for section index
				if (!dataBlob[sID]) {
					sectionIDs.push(sID);
					rowIDs[sectionIndex] = [];
					sectionIndex++
					dataBlob[sID] = sID;
				}

				rowIDs[rowIDs.length - 1].push(k);
				dataBlob[sID + ':' + k] = talk;
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
	render () {
		const { navigator } = this.props;
		const { dataSource } = this.state;

		const renderFooter = () => (
			<TouchableOpacity onPress={this.gotoEventInfo.bind(this)} activeOpacity={0.75}>
				<Text style={styles.link}>
					Event Info
				</Text>
			</TouchableOpacity>
		);

		return (
			<Scene>
				<Navbar
					title="Schedule"
					rightButtonText="Event Info"
					rightButtonOnPress={this.gotoEventInfo.bind(this)}
				/>

				<ListView
					dataSource={dataSource}
					enableEmptySections
					renderRow={(talk, idx) => {
						const onPress = () => navigator.push({
							enableSwipeToPop: true,
							scene: 'Talk',
							props: { talk },
						});
						let status = 'future';
						if (idx < 2) status = 'present';
						if (idx < 1) status = 'past';

						return (
							<Talk
								endTime={talk.time.end.toString()}
								onPress={onPress}
								speakerName={talk.speaker.name}
								speakerAvatarUri={talk.speaker.avatar}
								startTime={moment(talk.time.start).format(TIME_FORMAT)}
								status={status}
								title={talk.title}
							/>
						)
					}}
					renderSectionHeader={sectionData => <ListTitle text={sectionData} />}
					renderFooter={renderFooter}
				/>
			</Scene>
		);
	}
};

Schedule.propTypes = {
	navigator: PropTypes.object.isRequired,
	talks: PropTypes.object.isRequired,
};
Schedule.defaultProps = {
	talks: talkBlob,
};

const styles = StyleSheet.create({
	link: {
		color: theme.color.blue,
		fontSize: theme.fontSize.default,
		fontWeight: '500',
		paddingVertical: theme.fontSize.large,
		textAlign: 'center',
	},
});

module.exports = Schedule;
