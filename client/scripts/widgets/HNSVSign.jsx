import React, { Component, PropTypes } from 'react';
import StartPageWidget from './StartPageWidget';
import numeral from 'numeral';

const HNSVSign = ({
	description
}) => {
	return (
		<StartPageWidget
			url="//stratum.registercentrum.se/api/aggregate/hnsv/hnsvmap/total/share(ASignLanguage(1))?APIKey=bK3H9bwaG4o%3D"
			description={description}
			format={x => numeral(x).format('0.0 %')}
		/>
	);
}

HNSVSign.defaultProps = {};

export default HNSVSign
