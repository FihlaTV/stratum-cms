import React from 'react';
import { Col } from 'react-bootstrap';
import WidgetWrapper from './WidgetWrapper';

const WidgetContainer = ({ link, linkText, children }) =>
(
	<Col className="startpage-widget" md={3} sm={4}>
		{children}
		{link && linkText && <a href={link}>{linkText}</a>}
	</Col>
);

const StartPageWidget = ({ digit, description, link, linkText, keystoneWidget }) =>
{
	if (keystoneWidget) {
		return (
			<WidgetContainer link={link} linkText={linkText}>
				<WidgetWrapper id={keystoneWidget} description={description} />
			</WidgetContainer>
		);
	}
	return (
		<WidgetContainer link={link} linkText={linkText}>
			<span className="startpage-widget-digit">
				{digit}
			</span>
			<span className="startpage-widget-text">
				{description}
			</span>
		</WidgetContainer>
	);
};

export default StartPageWidget;
