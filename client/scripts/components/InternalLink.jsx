import React from 'react';

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
			<a href={link}>
				{linkText}
			</a>
		</p>
	</div>
);

export default InternalLink;
