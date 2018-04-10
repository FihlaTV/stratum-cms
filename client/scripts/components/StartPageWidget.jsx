import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import WidgetWrapper from './WidgetWrapper';
import PageLink from '../containers/PageLink';

const WidgetLink = ({ link, linkText, linkType, page = {} }) => {
	switch (linkType) {
		case 'page':
			return <PageLink pageId={page.shortId}>{linkText}</PageLink>;
		case 'static':
			return <a href={link}>{linkText}</a>;
		default:
			return null;
	}
};

const WidgetContainer = ({
	link,
	linkText,
	linkType,
	page,
	children,
	wide,
	wideJumbotron,
}) => (
	<Col
		className={
			(wideJumbotron ? 'startpage-widget-wide-jumbotron ' : '') +
			'startpage-widget'
		}
		md={wide ? 4 : 3}
		sm={4}
	>
		{children}
		<WidgetLink
			link={link}
			linkText={linkText}
			linkType={linkType}
			page={page}
		/>
	</Col>
);

const StartPageWidget = props => {
	const { digit, description, keystoneWidget, url, format } = props;

	if (keystoneWidget) {
		return (
			<WidgetContainer {...props}>
				<WidgetWrapper
					id={keystoneWidget}
					description={description}
					url={url}
					format={format}
				/>
			</WidgetContainer>
		);
	}
	return (
		<WidgetContainer {...props}>
			<span className="startpage-widget-digit">{digit}</span>
			<span className="startpage-widget-text">{description}</span>
		</WidgetContainer>
	);
};

StartPageWidget.propTypes = {
	wide: PropTypes.bool,
};

export default StartPageWidget;
