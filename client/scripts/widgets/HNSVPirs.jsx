import React, { Component, PropTypes } from 'react';
import StartPageWidget from './StartPageWidget';
import numeral from 'numeral';

const HNSVPirs = ({
	description
}) => {
	return (
		<StartPageWidget
			url="//stratum.registercentrum.se/api/aggregate/HNSV/HNSVBasePirs/total/mean(hnsv_basepirs_scale)?apikey=bK3H9bwaG4o="
			description={description}
			format={x => numeral(x).format('0')}
	/>
	);
}

HNSVPirs.defaultProps = {};

export default HNSVPirs
