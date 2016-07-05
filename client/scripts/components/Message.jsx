import React, { Component, PropTypes } from 'react';
import { Alert } from 'react-bootstrap';
 
class Message extends Component {
	render(){
		const { 
			id,
			title,
			text,
			onDismiss,
			visible,
			status
		} = this.props;
		if(visible){
			return (
				<Alert bsStyle={status} onDismiss={onDismiss ? () => onDismiss(id) : null}>
					<h4>{title}</h4>
					<p>{text}</p>
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
