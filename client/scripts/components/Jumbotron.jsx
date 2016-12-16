import React from 'react';
import { Row, Jumbotron as BootstrapJumbotron } from 'react-bootstrap';
import StartPageWidget from './StartPageWidget';

const Jumbotron = ({
	header,
	description,
	widgets = [],
	...props,
}) => (
	<BootstrapJumbotron {...props}>
		<h1>{header}</h1>
		{description && <div className="lead" dangerouslySetInnerHTML={{ __html: description.html }}/>}
		<Row>
			{widgets.map((widget) =>
				<StartPageWidget key={widget.slug} {...widget} wide={widgets.length < 4}/>
			)}
		</Row>
	</BootstrapJumbotron>
);


export default Jumbotron;
