import React from 'react';
import { Row } from 'react-bootstrap';
import StartPageWidget from './StartPageWidget';

const Jumbotron = ({
	header = 'Jumbotron',
	description = '<p><strong>Lead HTML text</strong></p>',
}) => (
	<div className="jumbotron">
		<h1>{header}</h1>
		<div className="lead" dangerouslySetInnerHTML={{ __html: description.html }}/>
		<Row>
			<StartPageWidget digit="78,7 %" description="Hur många patienter med SOM hörselprovas före rörinstättning på din klink?"/>
		</Row>
	</div>
);


export default Jumbotron;
