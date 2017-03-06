import React from 'react';

export default class MapView extends React.Component {
	render () {
		return React.createElement('MapView', this.props, this.props.children);
	}
}

class Marker extends React.Component {
	render () {
		return React.createElement('Marker', this.props, this.props.children);
	}

	showCallout () {}
}

MapView.Marker = Marker;
