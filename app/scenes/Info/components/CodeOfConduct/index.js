// @flow
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import theme from '../../../../theme';
import Modal from '../../../../components/Modal';

export default class CodeOfConduct extends Component {
	props: {
		onClose: () => mixed,
	};

	render () {
		const { onClose } = this.props;

		return (
			<Modal onClose={onClose} ref="modal" align="bottom" style={{ margin: 30 }}>
				<View style={styles.wrapper}>
					<ScrollView contentContainerStyle={styles.content}>
						<View>
							<Text style={[styles.heading, styles.heading1]}>Code of Conduct</Text>
						</View>
						<View>
							<Text style={styles.text}>All delegates, speakers and volunteers at React Conf are required to agree with the following code of conduct. Organizers will enforce this code throughout the event.</Text>
						</View>
						<View>
							<Text style={[styles.heading, styles.heading2]}>The Quick Version</Text>
							<Text style={styles.text}>Facebook is dedicated to providing a harassment-free conference experience for everyone, regardless of gender, sexual orientation, disability, physical appearance, body size, race, or religion. We do not tolerate harassment of conference participants in any form. Sexual language and imagery is not appropriate for any conference venue, including talks.</Text>
							<Text style={styles.text}>Conference participants violating these rules may be sanctioned or expelled from the conference without a refund at the discretion of the conference organizers.</Text>
						</View>
						<View>
							<Text style={[styles.heading, styles.heading2]}>The Less Quick Version</Text>
							<Text style={styles.text}>Harassment includes offensive verbal comments related to gender, sexual orientation, disability, physical appearance, body size, race, religion, sexual images in public spaces, deliberate intimidation, stalking, following, harassing photography or recording, sustained disruption of talks or other events, inappropriate physical contact, and unwelcome sexual attention.</Text>
							<Text style={styles.text}>Participants asked to stop any harassing behavior are expected to comply immediately.</Text>
							<Text style={styles.text}>If a participant engages in harassing behavior, the conference organizers may take any action they deem appropriate, including warning the offender or expulsion from the conference with no refund.</Text>
							<Text style={styles.text}>If you are being harassed, notice that someone else is being harassed, or have any other concerns, please contact a member of conference staff immediately.</Text>
							<Text style={styles.text}>Conference staff will be happy to help participants contact venue security or local law enforcement, provide escorts, or otherwise assist those experiencing harassment to feel safe for the duration of the conference. We value your attendance.</Text>
							<Text style={styles.text}>We expect participants to follow these rules at all conference venues and conference-related social events.</Text>
						</View>
					</ScrollView>
					<TouchableOpacity onPress={() => this.refs.modal.onClose()} style={styles.close} activeOpacity={0.75}>
						<Icon
							color={theme.color.gray40}
							name="ios-arrow-down"
							size={24}
							style={{ height: 16, marginTop: -6 }}
						/>
					</TouchableOpacity>
				</View>
			</Modal>
		);
	}
};

const BORDER_RADIUS = 6;

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: 'white',
		borderRadius: BORDER_RADIUS,
		maxHeight: 400,
		shadowColor: 'black',
		shadowOffset: { height: 1, width: 0 },
		shadowOpacity: 0.25,
		shadowRadius: 5,
	},
	content: {
		padding: theme.fontSize.default,
	},

	// text
	text: {
		color: theme.color.gray60,
		fontSize: 13,
		lineHeight: theme.fontSize.default,
		marginTop: theme.fontSize.small,
	},
	heading: {
		color: theme.color.gray70,
		fontSize: theme.fontSize.small,
		fontWeight: 'bold',
	},
	heading1: {
		fontSize: theme.fontSize.default,
	},
	heading2: {
		fontSize: theme.fontSize.small,
		marginTop: theme.fontSize.large,
	},

	// close
	close: {
		alignItems: 'center',
		backgroundColor: theme.color.gray05,
		borderBottomLeftRadius: BORDER_RADIUS,
		borderBottomRightRadius: BORDER_RADIUS,
		height: 40,
		justifyContent: 'center',
		shadowColor: 'black',
		shadowOffset: { height: -1, width: 0 },
		shadowOpacity: 0.1,
		shadowRadius: 0,
	},
	closeText: {
		color: theme.color.gray40,
		fontWeight: '500',
	},
});
