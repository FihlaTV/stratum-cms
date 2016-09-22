import React, { PropTypes } from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({
		id,
		title,
		text,
		onDismiss,
		visible = true,
		children,
		className,
		status,
	}) =>
	visible
	? (
		<Alert className={className} bsStyle={status} onDismiss={onDismiss ? () => onDismiss(id) : null}>
			{title && <h4>{title}</h4>}
			{text && <p>{text}</p>}
			{children}
		</Alert>
	) : null;

Message.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string,
	status: PropTypes.oneOf(['success', 'info', 'warning', 'danger']),
	text: PropTypes.string,
	title: PropTypes.string,
	visible: PropTypes.bool,
};

export default Message;
