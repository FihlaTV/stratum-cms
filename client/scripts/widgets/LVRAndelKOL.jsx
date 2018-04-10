import React from 'react';
import StartPageWidget from './StartPageWidget';

const LVRAndelKOL = ({ description }) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/lvr/jumbotroner?nr=1&APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
		/>
	);
};

LVRAndelKOL.defaultProps = {};

export default LVRAndelKOL;
