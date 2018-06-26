import React from 'react';
import PropTypes from 'prop-types';
import Contact from './Contact';

const getTitle = (title, englishTitle, isEnglish, nrContacts) => {
	const _title = isEnglish ? englishTitle : title;
	if (Array.isArray(_title)) {
		return nrContacts > 1 ? _title[1] : _title[0];
	}
	return _title;
};

const ContactPersons = ({
	contacts = [],
	title,
	englishTitle,
	hideTitle,
	imageSize,
	isEnglish,
}) => (
	<div className="content-page-contacts">
		{!hideTitle &&
			contacts.length > 0 && (
				<h2>
					{getTitle(title, englishTitle, isEnglish, contacts.length)}
				</h2>
			)}
		{contacts.map((contact, i) => (
			<Contact {...contact} key={`contact-${i}`} imageSize={imageSize} />
		))}
	</div>
);

ContactPersons.defaultProps = {
	title: ['Kontaktperson', 'Kontaktpersoner'],
	englishTitle: 'Contacts',
};

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
	hideTitle: PropTypes.bool,
	isEnglish: PropTypes.bool,
	title: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};

export default ContactPersons;
