import React, { Component, PropTypes } from 'react';
import StratumSimpleData from './StratumSimpleData';

const BOAAndel = ({
}) => {
	return (
		<StratumSimpleData
			url="//stratum.registercentrum.se/api/aggregate/BOA/FirstVisitPatient/Total/count?APIKey=bK3H9bwaG4o%3D"
			>
			<p>antal registrerade i registret</p>
		</StratumSimpleData>
	);
}

export default BOAAndel
