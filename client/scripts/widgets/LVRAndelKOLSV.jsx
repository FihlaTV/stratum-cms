import React from 'react';
import StartPageWidget from './StartPageWidget';

const LVRAndelKOLSV = ({
	description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/lvr/jumbotroner?nr=3&APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
	/>
	);
};

LVRAndelKOLSV.defaultProps = {};

export default LVRAndelKOLSV;
