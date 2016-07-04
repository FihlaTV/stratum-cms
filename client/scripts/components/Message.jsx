import React, { Component, PropTypes } from 'react';
import { Alert } from 'react-bootstrap';
 
class Message extends Component {
	render(){
		const { 
			id,
			title,
			text,
			dismissible,
			status
		} = this.props;
		return (
			<Alert bsStyle={status} onDismiss={dismissible ? () => console.log('hide') : null}>
				<h4>{title}</h4>
				<p>{text}</p>
			</Alert>
		);
	}
}

Message.propTypes = {
	title: PropTypes.string
};

export default Message;
