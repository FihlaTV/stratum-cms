import React from 'react';
import PropTypes from 'prop-types';
import { Link as RLink } from 'react-router';

const Link = ({ to, children }) => {
	if (/^[a-zA-Z]+:\/\//.test(to)) {
		return <a href={to}>{children}</a>;
	} else {
		return <RLink to={to}>{children}</RLink>;
	}
};

const InternalLink = ({ title, description, link, linkText, icon }) => (
	<div className="internal-link">
		<h2>{title}</h2>
		{icon && <img src={icon.url} />}
		<p>
			{description}
			<br />
			<Link to={link}>{linkText}</Link>
		</p>
	</div>
);

InternalLink.propTypes = {
	description: PropTypes.string,
	icon: PropTypes.shape({
		url: PropTypes.string,
	}),
	link: PropTypes.string,
	linkText: PropTypes.string,
	title: PropTypes.string,
};

export default InternalLink;
