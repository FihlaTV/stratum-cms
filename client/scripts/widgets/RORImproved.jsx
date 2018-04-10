import React from 'react';
import StartPageWidget from './StartPageWidget';

const RORImproved = ({ description }) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/ror/improved?APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
		/>
	);
};

RORImproved.defaultProps = {};

export default RORImproved;
