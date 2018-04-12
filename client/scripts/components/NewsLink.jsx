import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const NewsLink = ({ slug = '', children, ...props }) => (
	<Link to={`/nyheter/${slug}`} {...props}>
		{children}
	</Link>
);

NewsLink.propTypes = {
	slug: PropTypes.string,
};

export default NewsLink;
