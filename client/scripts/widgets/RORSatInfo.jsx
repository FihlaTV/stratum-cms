import React from 'react';
import StartPageWidget from './StartPageWidget';

const RORSatInfo = ({ description }) => {
	return (
		<StartPageWidget
			url="/stratum/api/aggregate/ror/rorpost6/total/share(Post6SatInfo(2,3))?APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
		/>
	);
};

RORSatInfo.defaultProps = {};

export default RORSatInfo;
