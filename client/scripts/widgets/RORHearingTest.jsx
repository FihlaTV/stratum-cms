import React from 'react';
import StartPageWidget from './StartPageWidget';

const RORHearingTest = ({
	description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/aggregate/ror/rorpre/total/share(PreHearingTest(1))?PreOpIndic=1&APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
		/>
	);
};

RORHearingTest.defaultProps = {};

export default RORHearingTest;
