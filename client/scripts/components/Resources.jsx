import React from 'react';

const Resources = ({ resources }) => (
	<div className="resource-list">
		<h2>Dokument att ladda ner</h2>
		<ul>
			{resources.map(resource => (
				<li key={resource.title}>
					<i className={`resource-icon resource-${resource.filetype}`}></i>
					<a href={resource.fileUrl}>{resource.title}</a>
					<p>{resource.description}</p>
				</li>
			))}
		</ul>
	</div>
);

export default Resources;
