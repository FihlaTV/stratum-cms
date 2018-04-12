import React from 'react';
import { Image } from 'react-bootstrap';

const ImageWidget = ({ url }) => {
	return (
		<div className="information-blurb">
			<Image src={url} responsive className="base-column" />
		</div>
	);
};

ImageWidget.propTypes = {};

export default ImageWidget;
