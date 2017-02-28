import React, { Component, PropTypes } from 'react';
import { ActionSheetIOS, Animated, Dimensions } from 'react-native';
import moment from 'moment';

import { TIME_FORMAT } from '../../constants';
import Navbar from '../../components/Navbar';
import Scene from '../../components/Scene';

import theme from '../../theme';
import { bindMethods } from '../../utils';
import { getNextTalkFromId, getPrevTalkFromId } from '../../data/talks';

import Hint from './components/Hint';
import Speaker from './components/Speaker';
import TalkPane from './components/Pane';

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
			animValue: new Animated.Value(0),
			modalIsOpen: false,
			nextTalk: props.nextTalk,
			prevTalk: props.prevTalk,
			showIntro: props.introduceUI,
			talk: props.talk,
		};
	}

	handleLayout ({ height }) {
		const availableHeight = this.sceneHeight - (height);

		this.talkpane.refs.summary.measure((left, top, width, height) => {
			if (availableHeight > height) {
				this.talkpane.refs.summary.setNativeProps({ style: { minHeight: availableHeight - theme.nextup.height } });
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

		if (scrollY > 0 && this.talkpane.refs.nextTalkPreview) {
			const opacity = Math.min((scrollY - heightOffset) / 100, 1);

			this.talkpane.refs.nextTalkPreview.setNativeProps({ style: { opacity } });
		} else if (this.talkpane.refs.prevTalkPreview) {
			const opacity = Math.min(Math.abs(scrollY) / 100, 1);

			this.talkpane.refs.prevTalkPreview.setNativeProps({ style: { opacity } });
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

		this.setTalks({ nextTalk, prevTalk, talk }, 'next');
	}
	renderPrevTalk () {
		if (!this.state.prevTalk) return;

		const talk = this.state.prevTalk;
		const nextTalk = this.state.talk;
		const prevTalk = this.state.prevTalk
			? getPrevTalkFromId(this.state.prevTalk.id)
			: null;

		this.setTalks({ nextTalk, prevTalk, talk }, 'prev');
	}
	setTalks (newState, transitionDirection) {
		this.talkpane.refs.scrollview.setNativeProps({ bounces: false });

		this.setState({ outgoingTalk: newState.talk, transitionDirection }, () => {
			Animated.spring(this.state.animValue, {
				toValue: 1,
				friction: 7,
				tension: 30,
			}).start(() => {
				this.setState(Object.assign(newState, { outgoingTalk: null }), () => {
					this.state.animValue.setValue(0);
					this.talkpane.refs.scrollview.setNativeProps({ bounces: true });
					this.talkpane.refs.scrollview.scrollTo({
						y: 0,
						animated: false,
					});
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
	toggleSpeakerModal (modalIsOpen) {
		this.setState({ modalIsOpen });
	}
	render () {
		const { navigator } = this.props;
		const {
			animValue,
			modalIsOpen,
			nextIsActive,
			nextTalk,
			prevIsActive,
			prevTalk,
			showIntro,
			talk,
		} = this.state;

		const headerTitle = moment(talk.time.start).format(TIME_FORMAT);
		const availableHeight = this.sceneHeight - theme.navbar.height;

		const incomingFrom = this.state.transitionDirection === 'next'
			? -this.sceneHeight
			: this.sceneHeight;
		const outgoingTo = this.state.transitionDirection === 'next'
			? this.sceneHeight
			: -this.sceneHeight;

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
						nextTalkPreviewIsEngaged={nextIsActive}
						prevTalk={prevTalk}
						prevTalkPreviewIsEngaged={prevIsActive}
						showSpeakerModal={() => this.toggleSpeakerModal(true)}
						visibleTalk={talk}
						onHeroLayout={({ nativeEvent: { layout } }) => this.handleLayout(layout)}
						onScroll={this.handleScroll}
						onScrollEndDrag={this.handleScrollEndDrag}
						ref={r => (this.talkpane = r)}
					/>
				</Animated.View>
				{!!this.state.outgoingTalk && (
					<Animated.View style={[transitionStyles, incomingTransitionStyles]} pointerEvents="none">
						<TalkPane
							visibleTalk={this.state.outgoingTalk}
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
