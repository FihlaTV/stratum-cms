import React, { PropTypes } from 'react';
import { Col, Row } from 'react-bootstrap';

const Image = ({ image, clickable }) => {
	const img = <img src={image.url} alt={image.description} className="img-response"/>;
	if (clickable) {
		return (
			<a href={image.nativeUrl}>
				{img}
			</a>
		);
	}
	return img;
};

const DockedImages = ({ images, clickable }) => {
	return (
		<div className="content-page-images">
			<Row>
			{images && images.map((image, i) =>
				<Col md={12} sm={6} xs={12} key={`extra-image-${i}`}>
					<div className="caption-image">
						<Image clickable image={image}/>
						{image.description && <div className="caption-text">{image.description}</div>}
					</div>
				</Col>
				)}
			</Row>
		</div>
	);
};

DockedImages.propTypes = {
	images: PropTypes.arrayOf(
		PropTypes.shape({
			url: PropTypes.string.isRequired,
			nativeUrl: PropTypes.string,
			description: PropTypes.string,
		})
	),
};

export default DockedImages;
