import React, { Component, PropTypes } from 'react';
import { Alert } from 'react-bootstrap';
 
class Message extends Component {
	render(){
		const { 
			id,
			title,
			text,
			onDismiss,
			visible = true,
			children,
			className,
			status
		} = this.props;
		if(visible){
			return (
				<Alert className={className} bsStyle={status} onDismiss={onDismiss ? () => onDismiss(id) : null}>
					{title && <h4>{title}</h4>}
					{text && <p>{text}</p>}
					{children}
				</Alert>
			);
		}
		return null;
	}
}

Message.propTypes = {
	title: PropTypes.string
};

export default Message;
