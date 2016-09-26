import React from 'react';
import StartPageWidget from './StartPageWidget';

const HNSVRehabTotal = ({
	description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/hnsv/rehab?simple=1&APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
	/>
	);
};

HNSVRehabTotal.defaultProps = {};

export default HNSVRehabTotal;
