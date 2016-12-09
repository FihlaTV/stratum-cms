import React from 'react';
import { Row } from 'react-bootstrap';
import StartPageWidget from './StartPageWidget';

const Jumbotron = ({
	header = 'Jumbotron',
	description = '<p><strong>Lead HTML text</strong></p>',
	widgets = [],
}) => (
	<div className="jumbotron">
		<h1>{header}</h1>
		<div className="lead" dangerouslySetInnerHTML={{ __html: description.html }}/>
		<Row>
			{widgets.map(({ slug, digit, description, keystoneWidget }) =>
				<StartPageWidget keystoneWidget={keystoneWidget} key={slug} digit={digit} description={description}/>
			)}
		</Row>
	</div>
);


export default Jumbotron;
