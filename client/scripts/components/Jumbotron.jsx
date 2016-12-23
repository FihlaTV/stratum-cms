import React from 'react';
import { Row, Jumbotron as BootstrapJumbotron, Grid, Col } from 'react-bootstrap';
import StartPageWidget from './StartPageWidget';

const WideJumbotron = ({ header, widgets }) => (
	<Grid>
		<Col sm={12}>
			<h1>{header}</h1>
			<Row>
				{widgets.slice(0, 2).map((widget) =>
					<StartPageWidget key={widget.slug} {...widget}/>
				)}
			</Row>
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
	className,
	...props,
}) => (
	<BootstrapJumbotron className={className} {...props}>
		{type === 'wide'
			? <WideJumbotron header={header} widgets={widgets}/>
			: <RegularJumbotron header={header} description={description} widgets={widgets}/>
		}
	</BootstrapJumbotron>
);


export default Jumbotron;
