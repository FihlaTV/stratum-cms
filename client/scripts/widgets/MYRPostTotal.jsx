import React from 'react';
import StartPageWidget from './StartPageWidget';

const MYRPostTotal = ({ description }) => {
	return (
		<StartPageWidget
			url="/stratum/api/aggregate/myr/myrosspost/total/count?APIKey=bK3H9bwaG4o="
			description={description}
			format="0"
		/>
	);
};

MYRPostTotal.defaultProps = {};

export default MYRPostTotal;
