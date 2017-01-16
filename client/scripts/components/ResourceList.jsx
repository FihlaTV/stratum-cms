import React, { PropTypes } from 'react';

const ResourceList = ({ resources, container, title = 'Dokument att ladda ner' }) => (
	<div className={`resource-list${container ? ' side-area side-area-secondary' : ''}`}>
		<h2>{title}</h2>
		<ul>
			{resources.map(({ title, fileType = 'other', fileUrl, description }) => (
				<li key={title}>
					<i className={`resource-icon resource-${fileType}`}></i>
					<a href={fileUrl}>{title}</a>
					<p>{description}</p>
				</li>
			))}
		</ul>
	</div>
);

ResourceList.propTypes = {
	container: PropTypes.bool,
	resources: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string,
		fileType: PropTypes.string,
		description: PropTypes.string,
	})),
	title: PropTypes.string,
};

export default ResourceList;
