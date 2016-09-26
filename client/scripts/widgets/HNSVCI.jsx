import React from 'react';
import StartPageWidget from './StartPageWidget';

const HNSVCI = ({
	description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/hnsv/implantat?simple=1&APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
	/>
	);
};

HNSVCI.defaultProps = {};

export default HNSVCI;
