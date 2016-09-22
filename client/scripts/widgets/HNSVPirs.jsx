import React from 'react';
import StartPageWidget from './StartPageWidget';

const HNSVPirs = ({
	description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/aggregate/HNSV/HNSVBasePirs/total/mean(hnsv_basepirs_scale)?apikey=bK3H9bwaG4o="
			description={description}
			format="0"
		/>
	);
};

HNSVPirs.defaultProps = {};

export default HNSVPirs;
