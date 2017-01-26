import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const NewsLink = ({
	slug = '',
	children,
	...props,
}) => (
	<Link to={`/react/nyheter/${slug}`} {...props}>{children}</Link>
);

NewsLink.propTypes = {
	slug: PropTypes.string,
};

export default NewsLink;
