import React, { Component, PropTypes } from 'react';
import { ListView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';

import { TIME_FORMAT } from '../../constants';
import { list as talksList } from '../../data/talks';
import Header from '../../components/Header';
import ListTitle from '../../components/ListTitle';
import Scene from '../../components/Scene';
import theme from '../../theme';

import Talk from './components/Talk';

class Schedule extends Component {
	constructor (props) {
		super(props);

		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		this.state = {
			dataSource: ds.cloneWithRows(props.talks),
		};
	}
	gotoEventInfo () {
		this.props.navigator.push({
			scene: 'Info',
			sceneConfig: 'FloatFromBottom',
		});
	}
	render () {
		const { navigator } = this.props;
		const { dataSource } = this.state;

		return (
			<Scene>
				<Header
					title="Schedule"
					rightButtonText="Event Info"
					rightButtonOnPress={this.gotoEventInfo.bind(this)}
				/>
				<ListView
					dataSource={dataSource}
					enableEmptySections
					renderRow={(talk, idx) => {
						const onPress = () => navigator.push({
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
					// renderSeparator={(sectionId, rowId) => <RowSeparator key={rowId} />}
					renderSectionHeader={(sectionData, sectionId) => <ListTitle text="Monday" sectionData={sectionData} sectionId={sectionId} />}
				/>
				{/* <ScrollView style={{ flex: 1 }}>
					{talks.map((talk, idx) => {
						const onPress = () => navigator.push({
							scene: 'Talk',
							props: { talk },
						});
						let status = 'future';
						if (idx < 2) status = 'present';
						if (idx < 1) status = 'past';

						return (
							<Talk
								endTime={talk.time.end.toString()}
								key={idx}
								onPress={onPress}
								speakerName={talk.speaker.name}
								speakerAvatarUri={talk.speaker.avatar}
								startTime={moment(talk.time.start).format(TIME_FORMAT)}
								status={status}
								title={talk.title}
							/>
						);
					})}
				</ScrollView> */}
				{/* <TouchableOpacity onPress={this.gotoEventInfo.bind(this)} activeOpacity={0.75}>
					<Text style={styles.link}>
						Event Info
					</Text>
				</TouchableOpacity> */}
			</Scene>
		);
	}
};

Schedule.propTypes = {
	navigator: PropTypes.object.isRequired,
	talks: PropTypes.array.isRequired,
};
Schedule.defaultProps = {
	talks: talksList,
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
