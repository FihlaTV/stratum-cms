import React from 'react';
import StartPageWidget from './StartPageWidget';

const FONOPatientenket = ({ description }) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/fono/patientenket?APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
		/>
	);
};

FONOPatientenket.defaultProps = {};

export default FONOPatientenket;
