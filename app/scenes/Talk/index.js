import React, { Component, PropTypes } from 'react';
import {
	ActionSheetIOS,
	LayoutAnimation,
	PixelRatio,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native';
import moment from 'moment';

import { TIME_FORMAT } from '../../constants';
import Avatar from '../../components/Avatar';
import Navbar from '../../components/Navbar';
import Scene from '../../components/Scene';

import theme from '../../theme';
import { getNextTalkFromId } from '../../data/talks';

import Nextup from './components/Nextup';
import NextupInstructions from './components/Nextup/Instructions';
import Speaker from './components/Speaker';

export default class Talk extends Component {
	constructor (props) {
		super(props);

		this.toggleSpeakerModal = this.toggleSpeakerModal.bind(this);

		this.state = {
			modalIsOpen: false,
			nextTalk: null,
			talk: props.talk,
		};
	}
	componentDidMount () {
		this.getNextTalk(this.props.talk.id);
	}

	handleScroll (event) {
		const contentHeight = event.nativeEvent.contentSize.height;
		const viewHeight = event.nativeEvent.layoutMeasurement.height;
		const scrollY = event.nativeEvent.contentOffset.y;
		const heightOffset = contentHeight > viewHeight
			? contentHeight - viewHeight
			: 0;
		const scrollThreshold = 80; // distance before we load the next talk

		if (scrollY > (heightOffset + scrollThreshold)) {
			this.setState({ pullToLoadActive: true });
		} else {
			this.setState({ pullToLoadActive: false });
		}
	}
	handleScrollEndDrag () {
		if (this.state.pullToLoadActive) {
			this.setState({ pullToLoadActive: false }, this.renderNextTalk);
		}
	}
	getNextTalk (ID) {
		const nextTalk = getNextTalkFromId(ID);

		this.setState({ nextTalk });
	}
	renderNextTalk () {
		LayoutAnimation.easeInEaseOut();

		const talk = this.state.nextTalk;
		const nextTalk = getNextTalkFromId(this.state.nextTalk.id);

		this.setState({ nextTalk, talk }, () => {
			setTimeout(() => this.refs.scrollview.scrollTo({
				x: 0,
				y: 0,
				animated: true,
			}), 1);
		});
	}
	share () {
		const { talk } = this.state;
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
	toggleSpeakerModal (modalIsOpen) {
		this.setState({ modalIsOpen }, () => {
			StatusBar.setBarStyle(modalIsOpen ? 'light-content' : 'default', true);
		});
	}
	render () {
		const { navigator } = this.props;
		const { modalIsOpen, nextTalk, pullToLoadActive, talk } = this.state;

		const headerTitle = moment(talk.time.start).format(TIME_FORMAT);

		return (
			<Scene>
				<Navbar
					title={headerTitle}
					leftButtonIconName="ios-arrow-back"
					leftButtonOnPress={navigator.popToTop}
					rightButtonText="Share"
					rightButtonOnPress={this.share.bind(this)}
				/>

				<ScrollView style={{ flex: 1 }} scrollEventThrottle={300} onScroll={this.handleScroll.bind(this)} onScrollEndDrag={this.handleScrollEndDrag.bind(this)} ref="scrollview">
					<TouchableHighlight onPress={() => this.toggleSpeakerModal(true)} underlayColor="rgba(0,0,0,0.04)" activeOpacity={1}>
						<View style={styles.hero}>
							<Avatar source={talk.speaker.avatar} />
							<Text style={styles.heroSpeakerName}>
								{talk.speaker.name}
							</Text>
							<Text style={styles.heroTitle}>
								{talk.title}
							</Text>
						</View>
					</TouchableHighlight>

					<View style={styles.summary}>
						<Text style={styles.summaryText}>
							{talk.summary}
						</Text>
					</View>
					<View style={styles.nextupPlaceholder} />
				</ScrollView>

				{pullToLoadActive && (
					<NextupInstructions talkTitle={nextTalk.title} />
				)}
				{(!!nextTalk && !pullToLoadActive) && (
					<Nextup
						onPress={() => this.renderNextTalk()}
						speakerName={nextTalk.speaker.name}
						talkStartTime={moment(nextTalk.time.start).format(TIME_FORMAT)}
						talkTitle={nextTalk.title}
					/>
				)}

				{modalIsOpen && (
					<Speaker
						avatar={talk.speaker.avatar}
						github={talk.speaker.github}
						name={talk.speaker.name}
						onClose={() => this.toggleSpeakerModal(false)}
						summary={talk.speaker.summary}
						twitter={talk.speaker.twitter}
					/>
				)}
			</Scene>
		);
	}
};

Talk.propTypes = {
	navigator: PropTypes.object.isRequired,
	nextTalk: PropTypes.object,
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

	// make scrollable space for the nextup button
	nextupPlaceholder: {
		backgroundColor: 'transparent',
		height: 80,
	},
});
