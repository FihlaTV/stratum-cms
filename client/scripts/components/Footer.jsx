import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-bootstrap';

const Footer = ({ name, location = {}, email, phone }) => {
	const { street1, street2, city = '', zipCode = '' } = location;
	const cityComplete =
		!location.city && !location.zipCode
			? null
			: [zipCode, city].join(' ').trim();
	const Email = email ? <a href={`mailto:${email}`}>{email}</a> : null;
	return (
		<footer>
			<Grid>
				{[name, street1, street2, cityComplete, phone]
					.filter(x => !!x)
					.join(', ')}
				{Email && <br />}
				{Email}
			</Grid>
		</footer>
	);
};

Footer.propTypes = {
	email: PropTypes.string,
	location: PropTypes.shape({
		street1: PropTypes.string,
		street2: PropTypes.string,
		city: PropTypes.string,
		zipCode: PropTypes.string,
	}),
	name: PropTypes.string,
};

export default Footer;
