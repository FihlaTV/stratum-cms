import React from 'react';
import StartPageWidget from './StartPageWidget';

const SPOQTotal = ({ description }) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/spoq/jumbotron?apikey=bK3H9bwaG4o="
			description={description}
			format="0"
		/>
	);
};

SPOQTotal.defaultProps = {};

export default SPOQTotal;
