import React from 'react';
import StartPageWidget from './StartPageWidget';

const RORVentetid = ({
	description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/ror/ventetid?APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
		/>
	);
};

RORVentetid.defaultProps = {};

export default RORVentetid;
