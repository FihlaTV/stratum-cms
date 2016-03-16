import React, { Component, PropTypes } from 'react';
import StratumSimpleData from './StratumSimpleData';

const BOAAndel = ({
}) => {
	return (
		<StratumSimpleData
			url="//stratum.registercentrum.se/api/aggregate/BOA/UnitPraxis/Total/count(UP_UnitName)?APIKey=bK3H9bwaG4o%3D"
			>
			<p>En rolig andel istsället</p>
		</StratumSimpleData>
	);
}

export default BOAAndel
