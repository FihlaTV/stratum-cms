import React from 'react';
import StartPageWidget from './StartPageWidget';

const LVRAndelAstma = ({ description }) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/lvr/jumbotroner?nr=2&APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
		/>
	);
};

LVRAndelAstma.defaultProps = {};

export default LVRAndelAstma;
