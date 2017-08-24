import React, { PropTypes } from 'react';
import ReactGA from 'react-ga';

const ResourceList = ({ resources, inContainer, title = 'Dokument att ladda ner' }) => (
	<div className={`resource-list${inContainer ? ' side-area side-area-secondary' : ''}`}>
		<h2>{title}</h2>
		<ul>
			{resources.map(({ title, filename, hasFile, fileType = 'other', fileUrl, description }) => (
				<li key={title}>
					<i className={`resource-icon resource-${fileType}`}/>
					<a onClick={ReactGA.event({ category: 'Resources', action: 'Download', label: filename })} href={fileUrl}>{title}</a>
					<p>{description}</p>
				</li>
			))}
		</ul>
	</div>
);

ResourceList.propTypes = {
	inContainer: PropTypes.bool,
	resources: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string,
		fileType: PropTypes.string,
		description: PropTypes.string,
	})),
	title: PropTypes.string,
};

export default ResourceList;
