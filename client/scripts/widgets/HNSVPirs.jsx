import React from 'react';
import StartPageWidget from './StartPageWidget';

const HNSVPirs = ({
	description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/hnsv/pirsny?simple=1&apikey=bK3H9bwaG4o="
			description={description}
			format="0.0"
	/>
	);
};

HNSVPirs.defaultProps = {};

export default HNSVPirs;
