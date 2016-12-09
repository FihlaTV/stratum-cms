import React from 'react';
import { Col } from 'react-bootstrap';

const StartPageWidget = ({ digit, description, link, linkText, keystoneWidget }) => (
	<Col className="startpage-widget" md={3} sm={4}>
		<span className="startpage-widget-digit">
			{digit}
		</span>
		<span className="startpage-widget-text">
			{description}
		</span>
		<a href={link}>{linkText}</a>
	</Col>
);

export default StartPageWidget;
