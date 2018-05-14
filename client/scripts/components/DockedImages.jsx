import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Image, Modal } from 'react-bootstrap';

class EnlargeableImage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showFullImage: false,
		};
	}
	toggleModal(show) {
		this.setState({
			showFullImage:
				typeof show !== 'undefined'
					? !!show
					: !this.state.showFullImage,
		});
	}
	render() {
		const { showFullImage } = this.state;
		const { image, enlargeable } = this.props;
		const img = (
			<Image src={image.url} alt={image.description} responsive />
		);
		if (enlargeable) {
			return (
				<div>
					<Modal
						show={showFullImage}
						onHide={() => this.toggleModal(false)}
						bsSize="large"
					>
						<Modal.Header closeButton>
							<Modal.Title>{image.description}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Image
								src={image.nativeUrl || image.url}
								responsive
								className="center-block"
							/>
						</Modal.Body>
					</Modal>
					<a
						href={image.nativeUrl}
						onClick={e => {
							e.preventDefault();
							this.toggleModal(true);
						}}
					>
						{img}
					</a>
				</div>
			);
		}
		return img;
	}
}

const DockedImages = ({
	images,
	enlargeable = false,
	imageXSCols = 12,
	imageSMCols = 6,
	imageMDCols = 12,
}) => {
	return (
		<div className="content-page-images">
			<Row>
				{images &&
					images.map((image, i) => (
						<Col
							md={imageMDCols}
							sm={imageSMCols}
							xs={imageXSCols}
							key={`extra-image-${i}`}
						>
							<div className="caption-image">
								<EnlargeableImage
									enlargeable={enlargeable}
									image={image}
								/>
								{image.description && (
									<div className="caption-text">
										{image.description}
									</div>
								)}
							</div>
						</Col>
					))}
			</Row>
		</div>
	);
};

const colValidation = (props, propName, componentName) => {
	if (props[propName] < 1 || props[propName] > 12) {
		return new Error(`${propName} should be between 1 and 12`);
	}
};

DockedImages.propTypes = {
	enlargeable: PropTypes.bool,
	imageMDCols: colValidation,
	imageSMCols: colValidation,
	imageXSCols: colValidation,
	images: PropTypes.arrayOf(
		PropTypes.shape({
			url: PropTypes.string.isRequired,
			nativeUrl: PropTypes.string,
			description: PropTypes.string,
		})
	),
};

export default DockedImages;
