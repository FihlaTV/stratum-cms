import React from 'react';
import StartPageWidget from './StartPageWidget';

const HNSVSign = ({
	description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/aggregate/hnsv/hnsvmap/total/share(ASignLanguage(1))?APIKey=bK3H9bwaG4o%3D"
			description={description}
			format="0.0 %"
		/>
	);
};

HNSVSign.defaultProps = {};

export default HNSVSign;
