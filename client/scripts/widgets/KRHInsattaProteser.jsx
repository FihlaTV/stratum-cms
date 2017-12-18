import React from 'react';
import StartPageWidget from './StartPageWidget';

const KRHInsattaProteser = ({
    description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/shpr/jumbotron?nr=2&APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
        />
    );
};

KRHInsattaProteser.defaultProps = {};

export default KRHInsattaProteser;
