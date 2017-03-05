// @flow
import React, { Component } from 'react';
import {
	PixelRatio,
	StyleSheet,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Avatar from '../../../../components/Avatar';
import DraggableView from '../../../../components/DraggableView';
import Modal from '../../../../components/Modal';
import theme from '../../../../theme';
import { attemptToOpenUrl } from '../../../../utils';

type ButtonProps = {
	bordered?: boolean,
	icon: string,
	onPress: () => mixed,
	text: string,
};

function Button ({ bordered, icon, onPress, text }: ButtonProps) {
	const touchableProps = {
		activeOpacity: 1,
		onPress: onPress,
		style: styles.buttonTouchable,
		underlayColor: theme.color.gray05,
	};

	const dynamicStyles = {
		borderLeftColor: bordered ? theme.color.gray20 : null,
		borderLeftWidth: bordered ? 1 / PixelRatio.get() : null,
	};

	return (
		<TouchableHighlight {...touchableProps}>
			<View style={[styles.button, dynamicStyles]}>
				<Icon
					name={icon}
					size={24}
					style={styles.buttonIcon}
				/>
				<Text style={styles.buttonText}>{text}</Text>
			</View>
		</TouchableHighlight>
	);
};

export default class Speaker extends Component {
	props: {
		avatar: string,
		github?: string,
		name: string,
		onClose: () => mixed,
		summary: string,
		twitter?: string,
	};

	static defaultProps = {
		onPress () {},
	};

	handleClose = () => {
		this.refs.modal.onClose();
	};
	render () {
		const {
			avatar,
			github,
			name,
			onClose,
			summary,
			twitter,
		} = this.props;
		const showButtons = !!(github || twitter);

		// @jossmac Re: DraggableView - onRelease()
		// This is a bit janky but I like the Modal reuse, amenable to refactor

		return (
			<Modal onClose={onClose} ref="modal">
				<DraggableView style={styles.wrapper} allowX={false} onRelease={this.handleClose}>
					<View style={styles.main}>
						<Avatar source={avatar} size={75} />
						<Text style={styles.mainTitle}>{name}</Text>
						<Text style={styles.mainText}>{summary}</Text>
						<TouchableOpacity onPress={this.handleClose} activeOpacity={0.5} style={{
							position: 'absolute',
							top: 0,
							right: 0,
							height: 44,
							width: 44,
							alignItems: 'center',
							justifyContent: 'center',
						}}>
							<Icon color={theme.color.gray40} name="md-close" size={24} />
						</TouchableOpacity>
					</View>
					{showButtons && (
						<View style={styles.buttons}>
							{!!twitter && (
								<Button
									icon="logo-twitter"
									onPress={() => attemptToOpenUrl('https://twitter.com/' + twitter)}
									text={'@' + twitter}
								/>
							)}
							{!!github && (
								<Button
									bordered
									icon="logo-github"
									onPress={() => attemptToOpenUrl('https://github.com/' + github)}
									text={github}
								/>
							)}
						</View>
					)}
				</DraggableView>
			</Modal>
		);
	}
};

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: 'white',
		shadowColor: 'black',
		shadowOffset: { height: 1, width: 0 },
		shadowOpacity: 0.25,
		shadowRadius: 5,
	},

	// main
	main: {
		alignItems: 'center',
		padding: theme.fontSize.large,
	},
	mainTitle: {
		color: theme.color.text,
		fontSize: theme.fontSize.large,
		fontWeight: '300',
		marginVertical: theme.fontSize.default,
	},
	mainText: {
		color: theme.color.text,
		fontSize: 15,
		fontWeight: '300',
		lineHeight: 21,
		textAlign: 'center',
	},

	// buttons
	buttons: {
		overflow: 'hidden',
		flexDirection: 'row',
	},
	buttonTouchable: {
		backgroundColor: 'white',
		flex: 1,
	},
	button: {
		alignItems: 'center',
		borderTopColor: theme.color.gray20,
		borderTopWidth: 1 / PixelRatio.get(),
		paddingVertical: theme.fontSize.large,
	},
	buttonIcon: {
		color: theme.color.blue,
	},
	buttonText: {
		color: theme.color.gray60,
	},
});
