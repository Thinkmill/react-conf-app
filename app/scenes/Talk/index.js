// @flow
import React, { Component } from 'react';
import { ActionSheetIOS, Animated, Dimensions } from 'react-native';
import moment from 'moment';

import type {ScheduleTalk} from '../../types';
import { TIME_FORMAT } from '../../constants';
import Navbar from '../../components/Navbar';
import Scene from '../../components/Scene';

import theme from '../../theme';
import { bindMethods } from '../../utils';
import { getNextTalkFromId, getPrevTalkFromId } from '../../data/talks';

import Hint from './components/Hint';
import Speaker from './components/Speaker';
import TalkPane from './components/Pane';

type Props = {
	navigator: Object,
	nextTalk: ScheduleTalk | null,
	prevTalk: ScheduleTalk | null,
	talk: ScheduleTalk,
	introduceUI: boolean,
};

type TransitionDirection = 'prev' | 'next';

type State = {
	animValue: Animated.Value,
	modalIsOpen: boolean,
	nextTalk: ScheduleTalk | null,
	prevTalk: ScheduleTalk | null,
	showIntro: boolean,
	talk: ScheduleTalk,
	incomingTalk?: ScheduleTalk | null,
	transitionDirection?: TransitionDirection,
};

type SetTalksState = {
	talk: ScheduleTalk,
	nextTalk: ScheduleTalk | null,
	prevTalk: ScheduleTalk | null,
};

export default class Talk extends Component {
	sceneHeight: number;
	sceneWidth: number;

	talkpane: $FlowFixMe; // https://github.com/facebook/flow/issues/2202
	transitionpane: $FlowFixMe; // https://github.com/facebook/flow/issues/2202

	state: State;
	props: Props;

	static defaultProps = {
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

	constructor (props: Props) {
		super(props);

		bindMethods.call(this, [
			'handleScroll',
			'share',
			'toggleSpeakerModal',
		]);

		this.sceneHeight = Dimensions.get('window').height;
		this.sceneWidth = Dimensions.get('window').width;

		this.state = {
			animValue: new Animated.Value(0),
			modalIsOpen: false,
			nextTalk: props.nextTalk,
			prevTalk: props.prevTalk,
			showIntro: props.introduceUI,
			talk: props.talk,
		};
	}
	handleLayout ({ height }: { height: number }) {
		const availableHeight = this.sceneHeight - (height);

		this.talkpane.refs.summary.measure((left, top, width, height) => {
			if (availableHeight > height) {
				this.talkpane.refs.summary.setNativeProps({ style: { minHeight: availableHeight - theme.nextup.height } });
			}
		});

	}
	handleScroll ({ nativeEvent }: Object) {
		const contentHeight = nativeEvent.contentSize.height;
		const viewHeight = nativeEvent.layoutMeasurement.height;
		const scrollY = nativeEvent.contentOffset.y;
		const heightOffset = contentHeight > viewHeight
			? contentHeight - viewHeight
			: 0;
		const { nextTalkPreview, prevTalkPreview, scrollview } = this.talkpane.refs;
		const { nextTalk, prevTalk } = this.state;

		if (scrollY > 0 && nextTalkPreview) {
			const opacity = Math.min((scrollY - (heightOffset + 20)) / 100, 1);
			nextTalkPreview.setNativeProps({ style: { opacity } });
		} else if (prevTalkPreview) {
			const opacity = Math.min(Math.abs(scrollY + 20) / 100, 1);
			prevTalkPreview.setNativeProps({ style: { opacity } });
		}

		const jumpToNext = nextTalk && (scrollY > (heightOffset + 110));
		const jumpToPrev = prevTalk && (scrollY < -110);

		if (jumpToNext) {
			scrollview.setNativeProps({
				scrollEnabled: false,
				bounces: false,
			});
			this.renderNextTalk();
		} else if (jumpToPrev) {
			scrollview.setNativeProps({
				bounces: false,
				scrollEnabled: false,
			});
			this.renderPrevTalk();
		}
	}
	renderNextTalk () {
		const talk = this.state.nextTalk;
		const nextTalk = this.state.nextTalk
			? getNextTalkFromId(this.state.nextTalk.id)
			: null;
		const prevTalk = this.state.talk;

		if (talk !== null) {
			this.setTalks({ nextTalk, prevTalk, talk }, 'next');
		}
	}
	renderPrevTalk () {
		const talk = this.state.prevTalk;
		const nextTalk = this.state.talk;
		const prevTalk = this.state.prevTalk
			? getPrevTalkFromId(this.state.prevTalk.id)
			: null;

		if (talk !== null) {
			this.setTalks({ nextTalk, prevTalk, talk }, 'prev');
		}
	}
	setTalks (newState: SetTalksState, transitionDirection: TransitionDirection) {
		this.setState({
			incomingTalk: newState.talk,
			transitionDirection,
		}, () => {
			Animated.spring(this.state.animValue, {
				toValue: 1,
				friction: 7,
				tension: 30,
			}).start(() => {
				this.setState(Object.assign({}, newState, { incomingTalk: null }), () => {
					this.state.animValue.setValue(0);
					this.talkpane.refs.scrollview.setNativeProps({
						bounces: true,
						scrollEnabled: true,
					});
					this.talkpane.refs.scrollview.scrollTo({ y: 0, animated: false });
				});
			});
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
	toggleSpeakerModal (modalIsOpen: boolean) {
		this.setState({ modalIsOpen });
	}
	render () {
		const { navigator } = this.props;
		const {
			animValue,
			modalIsOpen,
			nextTalk,
			incomingTalk,
			prevTalk,
			showIntro,
			talk,
		} = this.state;

		const headerTitle = moment(talk.time.start).format(TIME_FORMAT);
		const availableHeight = this.sceneHeight - theme.navbar.height;

		const incomingFrom = this.state.transitionDirection === 'next'
			? this.sceneHeight
			: -this.sceneHeight;
		const outgoingTo = this.state.transitionDirection === 'next'
			? -this.sceneHeight
			: this.sceneHeight;

		const transitionStyles = {
			height: availableHeight,
			position: 'absolute',
			top: theme.navbar.height,
			width: this.sceneWidth,
		};
		const incomingTransitionStyles = {
			transform: [{
				translateY: animValue.interpolate({
					inputRange: [0, 1],
					outputRange: [incomingFrom, 0],
				}),
			}],
		};
		const outgoingTransitionStyles = {
			transform: [{
				translateY: animValue.interpolate({
					inputRange: [0, 1],
					outputRange: [0, outgoingTo],
				}),
			}],
		};

		// navbar must be rendered after the talk panes for visibility
		const navbar = (
			<Navbar
				title={headerTitle}
				leftButtonIconName="ios-arrow-back"
				leftButtonOnPress={navigator.popToTop}
				rightButtonText="Share"
				rightButtonOnPress={this.share}
			/>
		);

		return (
			<Scene>
				<Animated.View style={[transitionStyles, outgoingTransitionStyles]}>
					<TalkPane
						nextTalk={nextTalk}
						onHeroLayout={({ nativeEvent: { layout } }) => this.handleLayout(layout)}
						onScroll={this.handleScroll}
						prevTalk={prevTalk}
						ref={r => (this.talkpane = r)}
						showSpeakerModal={() => this.toggleSpeakerModal(true)}
						visibleTalk={talk}
					/>
				</Animated.View>
				{!!incomingTalk && (
					<Animated.View style={[transitionStyles, incomingTransitionStyles]} pointerEvents="none">
						<TalkPane
							visibleTalk={incomingTalk}
							ref={r => (this.transitionpane = r)}
						/>
					</Animated.View>
				)}

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
				{navbar}
			</Scene>
		);
	}
};
