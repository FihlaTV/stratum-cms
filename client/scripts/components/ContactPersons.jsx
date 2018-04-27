import React from 'react';
import PropTypes from 'prop-types';
import Contact from './Contact';

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
