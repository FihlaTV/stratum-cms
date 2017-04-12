import React from 'react';
import StartPageWidget from './StartPageWidget';

const LVRAndelAstma18 = ({
	description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/lvr/jumbotroner?nr=4&APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
	/>
	);
};

LVRAndelAstma18.defaultProps = {};

export default LVRAndelAstma18;
