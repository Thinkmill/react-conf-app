import React, { Component, PropTypes } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';

import { TIME_FORMAT } from '../../constants';
import { list as talksList } from '../../data/talks';
import Header from '../../components/Header';
import ListTitle from '../../components/ListTitle';
import Scene from '../../components/Scene';
import theme from '../../theme';

import Talk from './components/Talk';

class Schedule extends Component {
	gotoEventInfo () {
		this.props.navigator.push({
			scene: 'Info',
			sceneConfig: 'FloatFromBottom',
		});
	}
	render () {
		const { navigator, talks } = this.props;

		return (
			<Scene>
				<Header
					title="Schedule"
					rightButtonText="Event Info"
					rightButtonOnPress={this.gotoEventInfo.bind(this)}
				/>
				<ScrollView style={{ flex: 1 }}>
					<ListTitle text="Monday" />
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
					<TouchableOpacity onPress={this.gotoEventInfo.bind(this)} activeOpacity={0.75}>
						<Text style={styles.link}>
							Event Info
						</Text>
					</TouchableOpacity>
				</ScrollView>
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
