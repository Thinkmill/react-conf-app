import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../../../theme';

export default class CodeOfConduct extends Component {
	render () {
		const { onClose } = this.props;

		return (
			<View style={styles.wrapper}>
				<View>
					<Text style={styles.text}>All delegates, speakers and volunteers at React Conf are required to agree with the following code of conduct. Organizers will enforce this code throughout the event.</Text>
				</View>
				<View>
					<Text style={styles.heading}>The Quick Version</Text>
					<Text style={styles.text}>Facebook is dedicated to providing a harassment-free conference experience for everyone, regardless of gender, sexual orientation, disability, physical appearance, body size, race, or religion. We do not tolerate harassment of conference participants in any form. Sexual language and imagery is not appropriate for any conference venue, including talks.</Text>
					<Text style={styles.text}>Conference participants violating these rules may be sanctioned or expelled from the conference without a refund at the discretion of the conference organizers.</Text>
				</View>
				<View>
					<Text style={styles.heading}>The Less Quick Version</Text>
					<Text style={styles.text}>Harassment includes offensive verbal comments related to gender, sexual orientation, disability, physical appearance, body size, race, religion, sexual images in public spaces, deliberate intimidation, stalking, following, harassing photography or recording, sustained disruption of talks or other events, inappropriate physical contact, and unwelcome sexual attention.</Text>
					<Text style={styles.text}>Participants asked to stop any harassing behavior are expected to comply immediately.</Text>
					<Text style={styles.text}>If a participant engages in harassing behavior, the conference organizers may take any action they deem appropriate, including warning the offender or expulsion from the conference with no refund.</Text>
					<Text style={styles.text}>If you are being harassed, notice that someone else is being harassed, or have any other concerns, please contact a member of conference staff immediately.</Text>
					<Text style={styles.text}>Conference staff will be happy to help participants contact venue security or local law enforcement, provide escorts, or otherwise assist those experiencing harassment to feel safe for the duration of the conference. We value your attendance.</Text>
					<Text style={styles.text}>We expect participants to follow these rules at all conference venues and conference-related social events.</Text>
				</View>
				<TouchableOpacity onPress={onClose} style={styles.link}>
					<Icon
						color={theme.color.gray60}
						name="ios-arrow-up"
						size={24}
						style={{ height: 24 }}
					/>
					<Text style={styles.linkText}>CLOSE</Text>
				</TouchableOpacity>
		</View>
		);
	}
};

CodeOfConduct.propTypes = {
	onClose: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
	wrapper: {
		borderTopColor: theme.color.gray20,
		borderTopWidth: 1 / PixelRatio.get(),
		marginTop: theme.fontSize.large,
		paddingTop: theme.fontSize.large,
	},

	text: {
		color: theme.color.text,
		fontSize: 13,
		lineHeight: theme.fontSize.default,
		marginTop: theme.fontSize.small,
	},
	heading: {
		color: theme.color.text,
		fontSize: theme.fontSize.small,
		fontWeight: 'bold',
		marginTop: theme.fontSize.large,
	},

	link: {
		alignItems: 'center',
		borderTopColor: theme.color.gray20,
		borderTopWidth: 1 / PixelRatio.get(),
		marginTop: theme.fontSize.large,
		padding: theme.fontSize.default,
		justifyContent: 'center',
	},
	linkText: {
		color: theme.color.gray60,
		fontWeight: '500',
	},
});
