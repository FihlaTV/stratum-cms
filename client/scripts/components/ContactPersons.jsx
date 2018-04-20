import React from 'react';
import PropTypes from 'prop-types';
import { Image, Glyphicon } from 'react-bootstrap';

//  <span>{`${first.substr(0, 1)}${last.substr(0, 1)}`}</span>

const Placeholder = ({ name, size }) => {
	// const { first, last } = name;
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
	title,
	note,
	email,
	phone,
	displayPlaceholder = true,
}) => {
	return (
		<div className="contact">
			{image.url ? (
				<div className="contact-image">
					<Image
						width={imageSize && imageSize.width}
						height={imageSize && imageSize.height}
						src={image.url}
						alt={name}
					/>
				</div>
			) : (
				displayPlaceholder && (
					<div className="contact-image">
						<Placeholder name={name} size={imageSize} />
					</div>
				)
			)}
			<div className="contact-info">
				<h3>{`${name.first} ${name.last}`}</h3>
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

const ContactPersons = ({ contacts = [], imageSize }) => (
	<div className="content-page-contacts">
		{contacts.map((contact, i) => (
			<Contact {...contact} key={`contact-${i}`} imageSize={imageSize} />
		))}
	</div>
);

ContactPersons.propTypes = {
	contacts: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.shape({
				first: PropTypes.string.isRequired,
				last: PropTypes.string.isRequired,
			}),
			image: PropTypes.object,
			title: PropTypes.string,
			note: PropTypes.string,
			email: PropTypes.string,
			phone: PropTypes.string,
		})
	),
};

export default ContactPersons;
