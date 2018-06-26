import React from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

const onClickFn = fileUrl =>
	fileUrl
		? () =>
				ReactGA.event({
					category: 'Resources',
					action: 'Download',
					label: fileUrl.replace(/[^:]+:\/\/[^\/]+/, ''),
				})
		: null;

export const Resource = ({
	title,
	hasFile,
	fileType = 'other',
	fileUrl,
	description,
}) => (
	<li key={title}>
		<i className={`resource-icon resource-${fileType}`} />
		<a onClick={onClickFn(fileUrl)} href={fileUrl}>
			{title}
		</a>
		<p>{description}</p>
	</li>
);

const ResourceList = ({
	resources,
	inContainer,
	title,
	englishTitle,
	hideTitle,
	isEnglish,
}) => (
	<div
		className={`resource-list${
			inContainer ? ' side-area side-area-secondary' : ''
		}`}
	>
		{!hideTitle && <h2>{isEnglish ? englishTitle : title}</h2>}
		<ul>
			{resources.map((resourceProps, i) => (
				<Resource key={`resource-${i}`} {...resourceProps} />
			))}
		</ul>
	</div>
);

ResourceList.defaultProps = {
	title: 'Dokument att ladda ner',
	englishTitle: 'Documents',
};

ResourceList.propTypes = {
	englishTitle: PropTypes.string,
	hideTitle: PropTypes.bool,
	inContainer: PropTypes.bool,
	isEnglish: PropTypes.bool,
	resources: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string,
			fileType: PropTypes.string,
			description: PropTypes.string,
		})
	),
	title: PropTypes.string,
};

export default ResourceList;
