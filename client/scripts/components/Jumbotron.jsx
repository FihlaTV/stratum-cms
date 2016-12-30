import React, { PropTypes } from 'react';
import { Row, Jumbotron as BootstrapJumbotron, Grid, Col } from 'react-bootstrap';
import NewsLink from './NewsLink';
import StartPageWidget from './StartPageWidget';

const WideJumbotron = ({ header, newsItem, resource, widgets }) => (
	<Grid>
		<Col md={7} sm={10}>
			<h1>{header}</h1>
			{newsItem && <NewsLink slug={newsItem.slug} className="jumbotron-news-link">{newsItem.label}</NewsLink>}
			<hr/>
			<Row>
				{widgets.slice(0, 2).map((widget) =>
					<StartPageWidget key={widget.slug} {...widget} wide wideJumbotron />
				)}
			</Row>
			{resource && <a href={resource.url} target="_blank" className="jumbotron-resource-link">{resource.label}</a>}
		</Col>
	</Grid>
);

const RegularJumbotron = ({ header, widgets, description }) => (
	<div>
		<h1>{header}</h1>
		{description && <div className="lead" dangerouslySetInnerHTML={{ __html: description.html }}/>}
		<Row>
			{widgets.map((widget) =>
				<StartPageWidget key={widget.slug} {...widget} wide={widgets.length < 4}/>
			)}
		</Row>
	</div>
);

const Jumbotron = ({
	header,
	description,
	widgets = [],
	type,
	newsItem,
	resource,
	portal,
	...props,
}) => {
	const isWide = type === 'wide';

	let classNames = [];
	if (isWide) {
		classNames.push('jumbotron-wide');
	}
	if (portal) {
		classNames.push('jumbotron-portal');
	}
	return (
		<BootstrapJumbotron className={classNames.join(' ')} {...props}>
			{isWide
				? <WideJumbotron header={header} widgets={widgets} newsItem={newsItem} resource={resource}/>
				: <RegularJumbotron header={header} description={description} widgets={widgets}/>
			}
		</BootstrapJumbotron>
	);
};

Jumbotron.propTypes = {
	portal: PropTypes.bool,
};

export default Jumbotron;
