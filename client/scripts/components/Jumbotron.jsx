import React from 'react';
import { Row } from 'react-bootstrap';
import StartPageWidget from './StartPageWidget';

const Jumbotron = ({
	header,
	description,
	widgets = [],
}) => (
	<div className="jumbotron">
		<h1>{header}</h1>
		{description && <div className="lead" dangerouslySetInnerHTML={{ __html: description.html }}/>}
		<Row>
			{widgets.map((widget) =>
				<StartPageWidget key={widget.slug} {...widget} wide={widgets.length < 4}/>
			)}
		</Row>
	</div>
);


export default Jumbotron;
