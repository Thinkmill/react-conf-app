import React, { Component, PropTypes } from 'react';
import {
	ActionSheetIOS,
	Animated,
	Dimensions,
	PixelRatio,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import moment from 'moment';

import { TIME_FORMAT } from '../../constants';
import Avatar from '../../components/Avatar';
import Navbar from '../../components/Navbar';
import Scene from '../../components/Scene';

import theme from '../../theme';
import { bindMethods } from '../../utils';
import { getNextTalkFromId, getPrevTalkFromId } from '../../data/talks';

import Hint from './components/Hint';
import Preview from './components/Preview';
import PreviewInstructions from './components/Preview/Instructions';
import Speaker from './components/Speaker';

export default class Talk extends Component {
	constructor (props) {
		super(props);

		bindMethods.call(this, [
			'handleScroll',
			'handleScrollEndDrag',
			'share',
			'toggleSpeakerModal',
		]);

		this.sceneHeight = Dimensions.get('window').height;
		this.sceneWidth = Dimensions.get('window').width;

		this.state = {
			modalIsOpen: false,
			nextTalk: props.nextTalk,
			prevTalk: props.prevTalk,
			showIntro: props.introduceUI,
			talk: props.talk,
		};
	}

	handleLayout ({ height }) {
		const availableHeight = this.sceneHeight - (height);

		this.summary.measure((left, top, width, height) => {
			if (availableHeight > height) {
				this.summary.setNativeProps({ style: { minHeight: availableHeight - theme.nextup.height } });
			}
		});

	}
	handleScroll (event) {
		const contentHeight = event.nativeEvent.contentSize.height;
		const viewHeight = event.nativeEvent.layoutMeasurement.height;
		const scrollY = event.nativeEvent.contentOffset.y;
		const heightOffset = contentHeight > viewHeight
			? contentHeight - viewHeight
			: 0;

		if (scrollY > 0 && this.nextTalk) {
			const opacity = Math.min((scrollY - heightOffset) / 100, 1);

			this.nextTalk.setNativeProps({ style: { opacity } });
		} else if (this.prevTalk) {
			const opacity = Math.min(Math.abs(scrollY) / 100, 1);

			this.prevTalk.setNativeProps({ style: { opacity } });
		}
		this.setState({
			nextIsActive: scrollY > (heightOffset + 100),
			prevIsActive: scrollY < -100,
		});
	}
	handleScrollEndDrag () {
		if (this.state.nextIsActive) {
			this.setState({ nextIsActive: false }, this.renderNextTalk);
		} else if (this.state.prevIsActive) {
			this.setState({ prevIsActive: false }, this.renderPrevTalk);
		}
	}
	renderNextTalk () {
		if (!this.state.nextTalk) return;

		const talk = this.state.nextTalk;
		const nextTalk = this.state.nextTalk
			? getNextTalkFromId(this.state.nextTalk.id)
			: null;
		const prevTalk = this.state.talk;

		this.setTalks({ nextTalk, prevTalk, talk }, true);
	}
	renderPrevTalk () {
		if (!this.state.prevTalk) return;

		const talk = this.state.prevTalk;
		const nextTalk = this.state.talk;
		const prevTalk = this.state.prevTalk
			? getPrevTalkFromId(this.state.prevTalk.id)
			: null;

		this.setTalks({ nextTalk, prevTalk, talk });
	}
	setTalks ({ nextTalk, prevTalk, talk }, isNextTalk) {

		this.setState({ nextTalk, prevTalk, talk }, () => {
			if (isNextTalk) {
				requestAnimationFrame(() => {
					this.scrollview.scrollTo({
						y: 0,
						animated: true,
					});
				});
			}
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
		const {
			modalIsOpen,
			nextIsActive,
			nextTalk,
			prevIsActive,
			prevTalk,
			showIntro,
			talk,
		} = this.state;

		const headerTitle = moment(talk.time.start).format(TIME_FORMAT);
		const touchableProps = {
			activeOpacity: 0.66,
			onPress: () => this.toggleSpeakerModal(true),
		};

		return (
			<Scene>
				<Navbar
					title={headerTitle}
					leftButtonIconName="ios-arrow-back"
					leftButtonOnPress={navigator.popToTop}
					rightButtonText="Share"
					rightButtonOnPress={this.share}
				/>

				<ScrollView style={{ flex: 1 }} scrollEventThrottle={30} onScroll={this.handleScroll} onScrollEndDrag={this.handleScrollEndDrag} ref={r => (this.scrollview = r)}>
					{prevTalk && (
						<View ref={r => (this.prevTalk = r)} style={{ opacity: 0 }}>
							{prevIsActive ? (
								<PreviewInstructions
									talkTitle={prevTalk.title}
									position="top"
								/>
							) : (
								<Preview
									position="top"
									speakerName={prevTalk.speaker.name}
									talkStartTime={moment(prevTalk.time.start).format(TIME_FORMAT)}
									talkTitle={prevTalk.title}
								/>
							)}
						</View>
					)}
					<View style={styles.hero} onLayout={({ nativeEvent: { layout } }) => this.handleLayout(layout)}>
						<TouchableOpacity {...touchableProps}>
							<Animated.View style={styles.heroSpeaker}>
								<Avatar source={talk.speaker.avatar} />
								<Text style={styles.heroSpeakerName}>
									{talk.speaker.name}
								</Text>
								<Text style={styles.heroSpeakerHint}>
									(tap for more)
								</Text>
							</Animated.View>
						</TouchableOpacity>
						<Text style={styles.heroTitle}>
							{talk.title}
						</Text>
					</View>

					<View style={styles.summary} ref={r => (this.summary = r)}>
						<Text style={styles.summaryText}>
							{talk.summary}
						</Text>
					</View>

					{nextTalk && (
						<View ref={r => (this.nextTalk = r)} style={{ opacity: 0 }}>
							{nextIsActive ? (
								<PreviewInstructions
									talkTitle={nextTalk.title}
									position="bottom"
								/>
							) : (
								<Preview
									position="bottom"
									speakerName={nextTalk.speaker.name}
									talkStartTime={moment(nextTalk.time.start).format(TIME_FORMAT)}
									talkTitle={nextTalk.title}
								/>
							)}
						</View>
					)}
				</ScrollView>

				{showIntro && (
					<Hint
						onClose={() => this.setState({ showIntro: false })}
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
	talk: PropTypes.object.isRequired,
};
Talk.defaultProps = {
	talk: {
		id: 'max-stoiber',
		summary: 'What if we took the best of JavaScript and the best of CSS, and combined them together to create the ultimate styling solution for React? Glen Maddern (CSS Modules co-creator) and I sat down and starting thinking about this. Let\'s talk about what we thought about and why we arrived where we did – 💅 styled-components.',
		title: 'The Road to Styled Components',
		speaker: {
			avatar: 'https://www.gravatar.com/avatar/48619fc17b3ab68472aebd56c0106278?s=128',
			github: 'mxstbr',
			name: 'Max Stoiber',
			twitter: 'mxstbr',
			summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi a finibus ligula, sed congue eros. Proin nunc nunc, facilisis sit amet tempor et, finibus eu turpis.',
		},
		time: {
			start: new Date('2017-02-26T22:30:00.000Z'),
			end: new Date('2017-02-26T23:30:00.000Z'),
		},
	},
};

const styles = StyleSheet.create({
	hero: {
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomColor: theme.color.gray20,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderTopColor: theme.color.gray20,
		borderTopWidth: 1 / PixelRatio.get(),
		marginTop: -(1 / PixelRatio.get()),
		paddingHorizontal: theme.fontSize.large,
		paddingBottom: theme.fontSize.xlarge,
	},
	heroSpeaker: {
		alignItems: 'center',
		paddingHorizontal: theme.fontSize.xlarge,
		paddingTop: theme.fontSize.xlarge,
	},
	heroSpeakerHint: {
		color: theme.color.gray40,
		fontSize: theme.fontSize.xsmall,
		paddingBottom: theme.fontSize.large,
	},
	heroSpeakerName: {
		color: theme.color.blue,
		fontSize: theme.fontSize.default,
		fontWeight: '500',
		marginTop: theme.fontSize.small,
	},
	heroTitle: {
		fontSize: theme.fontSize.large,
		fontWeight: '300',
		textAlign: 'center',
	},

	// summary
	summary: {},
	summaryText: {
		fontSize: theme.fontSize.default,
		fontWeight: '300',
		lineHeight: theme.fontSize.large,
		padding: theme.fontSize.large,
	},
});
