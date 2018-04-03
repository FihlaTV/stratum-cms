import React, { PropTypes } from 'react';
import ReactGA from 'react-ga';

const ResourceList = ({ resources, inContainer, title = 'Dokument att ladda ner' }) => (
	<div className={`resource-list${inContainer ? ' side-area side-area-secondary' : ''}`}>
		<h2>{title}</h2>
		<ul>
			{resources.map(({ title, hasFile, fileType = 'other', fileUrl, description }) => (
				<li key={title}>
					<i className={`resource-icon resource-${fileType}`}/>
					<a onClick={() => {
						fileUrl && ReactGA.event({ category: 'Resources', action: 'Download', label: fileUrl.replace(/[^:]+:\/\/[^\/]+/, '') });
					}} href={fileUrl}>{title}</a>
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
