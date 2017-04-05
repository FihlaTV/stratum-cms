import React from 'react';
import StartPageWidget from './StartPageWidget';

const HNSVBaseRegistraions = ({
	description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/aggregate/hnsv/hnsvbase/total/count?APIKey=bK3H9bwaG4o="
			description={description}
			format="0"
		/>
	);
};

HNSVBaseRegistraions.defaultProps = {};

export default HNSVBaseRegistraions;
