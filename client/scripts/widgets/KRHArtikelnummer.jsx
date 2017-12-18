import React from 'react';
import StartPageWidget from './StartPageWidget';

const KRHArtikelnummer = ({
    description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/shpr/jumbotron?nr=3&APIKey=bK3H9bwaG4o="
			description={description}
			format="0"
        />
    );
};

KRHArtikelnummer.defaultProps = {};

export default KRHArtikelnummer;
