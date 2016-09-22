import React from 'react';
import StartPageWidget from './StartPageWidget';

const SEPOps = ({
	description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/aggregate/sep/seppost/total/count?APIKey=bK3H9bwaG4o="
			description={description}
			format="0"
		/>
	);
};

SEPOps.defaultProps = {};

export default SEPOps;
