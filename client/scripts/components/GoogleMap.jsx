import React from 'react';
import PropTypes from 'prop-types';
import {
	GoogleMap as GMap,
	Marker,
	withScriptjs,
	withGoogleMap,
} from 'react-google-maps';

const GoogleMap = withScriptjs(
	withGoogleMap(({ defaultZoom, lng, lat }) => (
		<GMap defaultZoom={defaultZoom} defaultCenter={{ lat: lat, lng: lng }}>
			<Marker position={{ lat: lat, lng: lng }} />
		</GMap>
	))
);

GoogleMap.propTypes = {
	defaultZoom: PropTypes.number,
	lat: PropTypes.number.isRequired,
	lng: PropTypes.number.isRequired,
};
GoogleMap.defaultProps = {
	googleMapURL:
		'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places',
	loadingElement: <div style={{ height: `100%` }} />,
	containerElement: <div style={{ height: `400px` }} />,
	mapElement: <div style={{ height: `100%` }} />,
	defaultZoom: 16,
};

export default GoogleMap;
