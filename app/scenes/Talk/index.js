import React, { Component, PropTypes } from 'react';
import { ActionSheetIOS, PixelRatio, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { shareOnTwitter } from 'react-native-social-share';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import { TIME_FORMAT } from '../../constants';
import Avatar from '../../components/Avatar';
import Header from '../../components/Header';
import Scene from '../../components/Scene';

import theme from '../../theme';
import { list as talksList } from '../../data/talks';

class Talk extends Component {
	getNextTalk () {
		// TODO
		return this.props.talk;
	}
	share () {
		const { talk } = this.props;
		const speakerHandle = talk.speaker.twitter
			? ('@' + talk.speaker.twitter)
			: talk.speaker.name;

		ActionSheetIOS.showShareActionSheetWithOptions({
			message: `Enjoying ${speakerHandle}'s talk "${talk.title}" #ReactConf2017`,
		},
		(error) => alert(error),
		(success, method) => {
			const result = success ? `Shared via ${method}` : 'Share cancelled';

			console.log(result);
		});
	}
	render () {
		const { navigator, talk } = this.props;
		const headerTitle = moment(talk.time.start).format(TIME_FORMAT);
		const nextTalk = this.getNextTalk();
		const gotoNextTalk = () => navigator.push({
			scene: 'Talk',
			props: { talk: nextTalk },
		});

		return (
			<Scene>
				<Header
					title={headerTitle}
					leftButtonIconName="ios-arrow-back"
					leftButtonOnPress={navigator.popToTop}
					rightButtonText="Share"
					rightButtonOnPress={this.share.bind(this)}
				/>
				<ScrollView style={{ flex: 1 }}>
					<View style={styles.hero}>
						<Avatar source={talk.speaker.avatar} />
						<Text style={styles.heroSpeakerName}>
							{talk.speaker.name}
						</Text>
						<Text style={styles.heroTitle}>
							{talk.title}
						</Text>
					</View>

					<View style={styles.summary}>
						<Text style={styles.summaryText}>
							{talk.summary}
						</Text>
					</View>
				</ScrollView>
				<TouchableOpacity style={styles.nextup} activeOpacity={0.75} onPress={gotoNextTalk}>
					<View style={styles.nextupText}>
						<Text style={styles.nextupTitle} numberOfLines={1}>
							{nextTalk.title}
						</Text>
						<Text style={styles.nextupSubtitle}>
							{moment(nextTalk.time.start).format(TIME_FORMAT)} &mdash; {nextTalk.speaker.name}
						</Text>
					</View>
					<Icon
						color={theme.color.text}
						name="ios-arrow-forward"
						size={20}
						style={styles.nextupIcon}
					/>
				</TouchableOpacity>
			</Scene>
		);
	}
};

Talk.propTypes = {
	navigator: PropTypes.object.isRequired,
	talk: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
	hero: {
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomColor: theme.color.gray20,
		borderBottomWidth: 1 / PixelRatio.get(),
		paddingHorizontal: theme.fontSize.default,
		paddingVertical: theme.fontSize.xlarge,
	},
	heroSpeakerName: {
		color: theme.color.blue,
		fontSize: theme.fontSize.default,
		fontWeight: '500',
		marginBottom: theme.fontSize.large,
		marginTop: theme.fontSize.small,
	},
	heroTitle: {
		fontSize: theme.fontSize.large,
		fontWeight: '300',
		textAlign: 'center',
	},

	// summary
	summary: {
		padding: theme.fontSize.default,
	},
	summaryText: {
		fontSize: theme.fontSize.default,
		fontWeight: '300',
		lineHeight: theme.fontSize.large,
	},

	// next talk
	nextup: {
		alignItems: 'center',
		borderTopColor: theme.color.gray20,
		borderTopWidth: 1 / PixelRatio.get(),
		flexDirection: 'row',
		paddingHorizontal: theme.fontSize.default,
		paddingVertical: theme.fontSize.small,
	},
	nextupText: {
		flex: 1,
	},
	nextupTitle: {},
	nextupSubtitle: {
		color: theme.color.gray60,
	},
	nextupIcon: {
		marginLeft: 10,
	},
});

module.exports = Talk;
