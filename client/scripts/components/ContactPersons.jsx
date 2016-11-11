import React, { PropTypes } from 'react';
import { Image, Glyphicon } from 'react-bootstrap';

const ContactPerson = ({
	name,
	imageUrl,
	description,
	email,
	phone,
}) => {
	return (
		<div className="contact-person">
			<div className="contact-person-info">
				<div className="contact-person-image">
					<Image src={imageUrl || '/images/avatar.png'} alt={name} />
				</div>
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
			imageUrl: PropTypes.string,
			description: PropTypes.string,
			email: PropTypes.string,
			phone: PropTypes.string,
		})
	),
};

export default ContactPersons;
