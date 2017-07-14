import React, { PropTypes } from 'react';
import { Row, Jumbotron as BootstrapJumbotron, Grid, Col } from 'react-bootstrap';
import NewsLink from './NewsLink';
import StartPageWidget from './StartPageWidget';

const WideJumbotron = ({ header, newsItem, resource, widgets }) => {
	const manyWidgets = widgets.length > 2;
	return (
		<Grid>
			<Col md={8} sm={10}>
				<h1>{header}</h1>
				{newsItem && <NewsLink slug={newsItem.slug} className="jumbotron-news-link">{newsItem.label}</NewsLink>}
				<hr/>
			</Col>
			<Col sm={manyWidgets ? 12 : 10} md={manyWidgets ? 12 : 8}>
				<Row>
					{widgets.slice(0, 4).map((widget) =>
						<StartPageWidget key={widget.slug} {...widget} wideJumbotron wide={!manyWidgets} />
					)}
				</Row>
				{resource && <a href={resource.url} target="_blank" className="jumbotron-resource-link">{resource.label}</a>}
			</Col>
		</Grid>
	);
};

const RegularJumbotron = ({ header, widgets, description }) => (
	<div>
		<h1>{header}</h1>
		{description && <div className="jumbotron-description" dangerouslySetInnerHTML={{ __html: description.html }}/>}
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
		if (widgets.length <= 2) {
			classNames.push('jumbotron-wide-fixed-height');
		}
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
