import React, { Component, PropTypes } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { list as talksList } from '../../data/talks';
import Header from '../../components/Header';

import Talk from './components/Talk';

class Schedule extends Component {
	render () {
		const { talks } = this.props;

		return (
			<View>
				<Header
					title="Schedule"
					rightButtonText="Event Info"
					rightButtonOnPress={() => console.log('test')}
				/>
				<ScrollView>
					{talks.map((talk, idx) => (
						<Talk
							endTime={talk.time.end.toString()}
							key={idx}
							onPress={() => console.log('pressed', talk.title)}
							speakerName={talk.speaker.name}
							speakerAvatarUri={'https:' + talk.speaker.avatar}
							startTime={moment(talk.time.start).format('h:mma')}
							title={talk.title}
						/>
					))}
				</ScrollView>
			</View>
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

module.exports = Schedule;
