import React from 'react';
import StartPageWidget from './StartPageWidget';

const FONOForbettring = ({ description }) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/fono/forbettring?APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
		/>
	);
};

FONOForbettring.defaultProps = {};

export default FONOForbettring;
