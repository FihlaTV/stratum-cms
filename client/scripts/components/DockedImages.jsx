import React, { PropTypes, Component } from 'react';
import { Col, Row, Image, Modal } from 'react-bootstrap';

class EnlargeableImage extends Component {
	constructor (props) {
		super(props);
		this.state = {
			showFullImage: false,
		};
	}
	toggleModal (show) {
		this.setState({
			showFullImage: typeof show !== 'undefined' ? !!show : !this.state.showFullImage,
		});
	}
	render () {
		const { showFullImage } = this.state;
		const { image, enlargeable } = this.props;
		const img = <Image src={image.url} alt={image.description} responsive/>;
		if (enlargeable) {
			return (
				<div>
					<Modal show={showFullImage} onHide={() => this.toggleModal(false)} bsSize="large">
						<Modal.Header closeButton>
							<Modal.Title>{image.description}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Image src={image.nativeUrl || image.url} responsive/>
						</Modal.Body>
					</Modal>
					<a href={image.nativeUrl} onClick={(e) => {
						e.preventDefault();
						this.toggleModal(true);
					}} >
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
	wide,
}) => {
	return (
		<div className="content-page-images">
			<Row>
			{images && images.map((image, i) =>
				<Col md={wide ? 6 : 12} sm={6} xs={12} key={`extra-image-${i}`}>
					<div className="caption-image">
						<EnlargeableImage enlargeable={enlargeable} image={image}/>
						{image.description && <div className="caption-text">{image.description}</div>}
					</div>
				</Col>
				)}
			</Row>
		</div>
	);
};

DockedImages.propTypes = {
	enlargeable: PropTypes.bool,
	images: PropTypes.arrayOf(
		PropTypes.shape({
			url: PropTypes.string.isRequired,
			nativeUrl: PropTypes.string,
			description: PropTypes.string,
		})
	),
};

export default DockedImages;
