import React from 'react';
import StartPageWidget from './StartPageWidget';

const HNSBChildrenNew = ({
	description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/aggregate/hnsb/hnsbbase/total/subjectcount?APIKey=bK3H9bwaG4o="
			description={description}
			format="0"
		/>
	);
};

HNSBChildrenNew.defaultProps = {};

export default HNSBChildrenNew;
