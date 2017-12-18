import React from 'react';
import StartPageWidget from './StartPageWidget';

const KRHOperationer = ({
    description,
}) => {
	return (
		<StartPageWidget
			url="/stratum/api/statistics/shpr/jumbotron?nr=1&APIKey=bK3H9bwaG4o="
			description={description}
			format="0.0 %"
        />
    );
};

KRHOperationer.defaultProps = {};

export default KRHOperationer;
