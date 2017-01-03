import React from 'react';

const InternalLink = ({
	title,
	description,
	link,
	linkText,
	icon,
}) => (
	<div>
		<h2>{title}</h2>
		<p>{description}
			<a href={link}>
				{linkText}
			</a>
		</p>
		{icon && <img src={icon.url}/>}
	</div>
);

export default InternalLink;
