import React, { Component, PropTypes } from 'react';
import { Alert } from 'react-bootstrap';
 
const Message = ({
		id,
		title,
		text,
		onDismiss,
		visible = true,
		children,
		className,
		status
	}) => 
	visible ? 
	(
		<Alert className={className} bsStyle={status} onDismiss={onDismiss ? () => onDismiss(id) : null}>
			{title && <h4>{title}</h4>}
			{text && <p>{text}</p>}
			{children}
		</Alert>
	) : null;

Message.propTypes = {
	id: PropTypes.string,
	title: PropTypes.string,
	text: PropTypes.string,
	visible: PropTypes.bool,
	className: PropTypes.string,
	status: PropTypes.oneOf(['success', 'info', 'warning', 'danger'])
};

export default Message;
