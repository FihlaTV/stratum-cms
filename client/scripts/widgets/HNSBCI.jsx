import React from 'react';
import StartPageWidget from './StartPageWidget';

const HNSBCI = ({ description }) => {
	return (
		<StartPageWidget
			url="/stratum/api/aggregate/hnsb/hnsbci/total/subjectcount?APIKey=bK3H9bwaG4o="
			description={description}
			format="0"
		/>
	);
};

HNSBCI.defaultProps = {};

export default HNSBCI;
