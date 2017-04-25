import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showMessage, initMessages, acceptCookie } from '../actions/messages';
import Message from '../components/Message';
import CookieMessage from '../components/CookieMessage';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Messages extends Component {
	componentDidMount () {
		const { dispatch } = this.props;
		dispatch(initMessages());
	}
	render () {
		const {
			messages = [],
			showCookieMessage,
			dispatch,
			...rest
		} = this.props;

		return (
			<div {...rest}>
				<ReactCSSTransitionGroup transitionName="alert-transition" transitionAppear transitionAppearTimeout={300} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
					{showCookieMessage && <CookieMessage key="cookie-message" onDismiss={
							() => dispatch(acceptCookie())
						}
					/>}
					{
						messages
							.filter(m => m.visible)
							.map(
								({ _id, title, message, dismissible, status }) =>
									<Message key={_id} id={_id} title={title} text={message} status={status} onDismiss={
										dismissible ? (id) => dispatch(showMessage(id, false)) : null
									}/>
							)
					}
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}
const mapStateToProps = ({ messages }) => {
	return {
		messages: messages.items,
		showCookieMessage: !messages.cookiesAccepted,
	};
};

export default connect(mapStateToProps)(Messages);
