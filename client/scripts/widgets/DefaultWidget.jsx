import React from 'react';
import StartPageWidget from './StartPageWidget';

const DefaultWidget = ({
	description, url, format,
}) => {
	return (
		<StartPageWidget
			url={url}
			description={description}
			format={format}
		/>
	);
};

DefaultWidget.defaultProps = {};

export default DefaultWidget;
