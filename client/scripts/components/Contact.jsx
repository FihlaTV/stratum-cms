import React from 'react';
import PropTypes from 'prop-types';
import { Image, Glyphicon } from 'react-bootstrap';

const Placeholder = ({ size }) => {
	return (
		<div className="contact-placeholder" style={size}>
			<Glyphicon glyph="user" />
		</div>
	);
};
export const Contact = ({
	name = {},
	image = {},
	imageSize,
	hideImage = false,
	title,
	note,
	email,
	phone,
	displayPlaceholder = true,
}) => {
	const fullName = `${name.first} ${name.last}`;

	return (
		<div className="contact">
			{!hideImage &&
				(image.url ? (
					<div className="contact-image">
						<Image
							width={imageSize && imageSize.width}
							height={imageSize && imageSize.height}
							src={image.url}
							alt={fullName}
						/>
					</div>
				) : (
					displayPlaceholder && (
						<div className="contact-image">
							<Placeholder size={imageSize} />
						</div>
					)
				))}
			<div className="contact-info">
				<h3>{fullName}</h3>
				{title && <p className="contact-title">{title}</p>}
				{note && <p className="contact-note">{note}</p>}
				{phone && (
					<p>
						<Glyphicon glyph="phone" />
						{phone}
					</p>
				)}
				{email && (
					<p>
						<a href={`mailto:${email}`}>
							<Glyphicon glyph="envelope" />
							{email}
						</a>
					</p>
				)}
			</div>
		</div>
	);
};

Contact.propTypes = {
	email: PropTypes.string,
	hideImage: PropTypes.bool,
	image: PropTypes.object,
	name: PropTypes.shape({
		first: PropTypes.string.isRequired,
		last: PropTypes.string.isRequired,
	}),
	note: PropTypes.string,
	phone: PropTypes.string,
	title: PropTypes.string,
};

export default Contact;
