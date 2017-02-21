import React, { Component, PropTypes } from 'react';
import {
	Image,
	LayoutAnimation,
	Linking,
	PixelRatio,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import moment from 'moment';

import { TIME_FORMAT } from '../../constants';
import Avatar from '../../components/Avatar';
import ListTitle from '../../components/ListTitle';
import Scene from '../../components/Scene';

import { list as organiserList } from '../../data/organisers';
import theme from '../../theme';

import CodeOfConduct from './components/CodeOfConduct';
import Organiser from './components/Organiser';

class Info extends Component {
	constructor (props) {
		super(props);

		this.toggleCodeOfConduct = this.toggleCodeOfConduct.bind(this);

		this.state = {
			codeOfConductIsOpen: false,
		};
	}
	toggleCodeOfConduct () {
		LayoutAnimation.easeInEaseOut();
		this.setState({ codeOfConductIsOpen: !this.state.codeOfConductIsOpen });
	}
	openMap () {
		const latlong = [37.354108, -121.955236]; // Santa Clara, California
		const url = `http://maps.apple.com/?ll=${latlong.join()}`;

		Linking.canOpenURL(url).then(supported => {
			if (supported) {
				Linking.openURL(url);
			} else {
				console.log('Linking to URL not supported on device.');
			}
		}).catch(err => console.error('An error occurred', err));
	}
	render () {
		const { navigator, organisers } = this.props;
		const { codeOfConductIsOpen } = this.state;
		const mapUri = 'https://maps.googleapis.com/maps/api/staticmap?center=Santa+Clara,+California&zoom=13&scale=2&size=600x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7CSanta+Clara,+California';

		return (
			<Scene scroll>
				<TouchableOpacity onPress={this.openMap} style={styles.mapButton} activeOpacity={0.75}>
					<Image
						source={{ uri: mapUri }}
						style={styles.mapImage}
					/>
				</TouchableOpacity>
				<ScrollView style={{ flex: 1 }}>
					<View style={styles.hero}>
						<Text style={styles.heroText}>
							The conference will be taking place on February 22nd and 23rd, with talks from 10am to 6pm each day. Plan to hang out with us each evening for plenty of socializing over food and drink
						</Text>
						<TouchableOpacity onPress={this.toggleCodeOfConduct} activeOpacity={0.75}>
							<Text style={styles.heroLink}>
								Code of Conduct
							</Text>
						</TouchableOpacity>
						{!!codeOfConductIsOpen && <CodeOfConduct onClose={this.toggleCodeOfConduct} />}
					</View>
					<ListTitle text="Organisers" />
					{organisers.map((organiser, idx) => {
						const onPress = () => {};

						return (
							<Organiser
								avatar={organiser.avatar}
								key={idx}
								onPress={() => {}}
								name={organiser.name}
								summary={organiser.summary}
							/>
						);
					})}
				</ScrollView>
					<View style={styles.madeby}>
						<Text style={styles.madebyText}>Made by Thinkmill</Text>
					</View>
			</Scene>
		);
	}
};

Info.propTypes = {
	navigator: PropTypes.object.isRequired,
	organisers: PropTypes.array.isRequired,
};
Info.defaultProps = {
	organisers: organiserList,
};

const styles = StyleSheet.create({
	// map
	mapButton: {
		backgroundColor: theme.color.gray05,
		height: 280,
	},
	mapImage: {
		height: 280,
	},

	// hero
	hero: {
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomColor: theme.color.gray20,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderTopColor: theme.color.gray30,
		borderTopWidth: 1 / PixelRatio.get(),
		paddingHorizontal: theme.fontSize.default,
		paddingVertical: theme.fontSize.xlarge,
	},
	heroText: {
		fontSize: theme.fontSize.default,
		fontWeight: '300',
		lineHeight: theme.fontSize.large,
		textAlign: 'center',
	},
	heroLink: {
		color: theme.color.blue,
		fontSize: theme.fontSize.default,
		fontWeight: '500',
		marginTop: theme.fontSize.default,
	},

	// made by thinkmill
	madeby: {
		alignItems: 'center',
		paddingHorizontal: theme.fontSize.default,
		paddingVertical: theme.fontSize.xlarge,
	},
	madebyText: {
		fontSize: theme.fontSize.default,
		fontWeight: '300',
		lineHeight: theme.fontSize.large,
		textAlign: 'center',
	},
});

module.exports = Info;
