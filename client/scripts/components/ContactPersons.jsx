import React from 'react';
import PropTypes from 'prop-types';
import { Image, Glyphicon } from 'react-bootstrap';

const ContactPerson = ({
	name,
	image = {},
	description,
	email,
	phone,
}) => {
	return (
		<div className="contact-person">
			<div className="contact-person-image">
				<Image src={image.url || '/images/avatar.png'} alt={name} />
			</div>
			<div className="contact-person-info">
				<h3>{name}</h3>
				{description && <p className="contact-person-title">{description}</p>}
				{phone && <p><Glyphicon glyph="phone" /> {phone}</p>}
				{email && <p><a href={`mailto:${email}`}><Glyphicon glyph="envelope" /> {email}</a></p>}
			</div>
		</div>
	);
};

const ContactPersons = ({
	contacts = [],
}) => (
	<div className="content-page-contacts">
		{contacts.map((contact, i) => <ContactPerson {...contact} key={`contact-${i}`} />)}
	</div>
);


ContactPersons.propTypes = {
	contacts: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			image: PropTypes.object,
			description: PropTypes.string,
			email: PropTypes.string,
			phone: PropTypes.string,
		})
	),
};

export default ContactPersons;
