import React, { Component, PropTypes } from 'react';
 
class Message extends Component {
	render(){
		const { 
			title,
			text
		} = this.props;
		return (
			<div>
				<span>{title}</span>
				<p>{text}</p>
			</div>
		);
	}
}

Message.propTypes = {
	title: PropTypes.string
};

export default Message;
