import React from 'react';
import { Link as RLink } from 'react-router';

const Link = ({ to, children }) => {
	if ((/^[a-zA-Z]+:\/\//).test(to)) {
		return <a href={to}>{children}</a>;
	} else {
		return <RLink to={to}>{children}</RLink>;
	}
};

const InternalLink = ({
	title,
	description,
	link,
	linkText,
	icon,
}) => (
	<div className="internal-link">
		<h2>{title}</h2>
		{icon && <img src={icon.url}/>}
		<p>{description}&nbsp;
			<Link to={link}>
				{linkText}
			</Link>
		</p>
	</div>
);

export default InternalLink;
