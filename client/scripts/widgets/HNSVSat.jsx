import React from 'react';
import StartPageWidget from './StartPageWidget';

const HNSVSat = ({ description }) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/hnsv/nytta?simple=1&APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
		/>
	);
};

HNSVSat.defaultProps = {};

export default HNSVSat;
