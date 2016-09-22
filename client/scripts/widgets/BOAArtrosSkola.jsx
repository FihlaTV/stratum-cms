import React, { Component, PropTypes } from 'react';
import StratumSimpleData from './StratumSimpleData';

const BOAArtrosSkola = ({
	description,
}) => {
	return (
		<StratumSimpleData
			url="/stratum/api/aggregate/BOA/UnitPraxis/Total/count(UP_UnitName)?APIKey=bK3H9bwaG4o%3D"
			>
			<p>{description}</p>
		</StratumSimpleData>
	);
};

BOAArtrosSkola.defaultProps = {};

export default BOAArtrosSkola;
