import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchMessages, showMessage, initMessages, acceptCookie } from '../actions/messages';
import Spinner from '../components/Spinner';
import Message from '../components/Message';
import CookieMessage from '../components/CookieMessage';
import { Button } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Messages extends Component {
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(initMessages());
	}
	render() {
		const {
			messages = [],
			showCookieMessage,
			dispatch
		} = this.props;

		return (
			<div>
				<ReactCSSTransitionGroup transitionName="alert-transition" transitionAppear transitionAppearTimeout={300} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
					{showCookieMessage && <CookieMessage key="cookie-message" onDismiss={
							() => dispatch(acceptCookie())
						}
					/>}
					{
						messages
							.filter(m => m.visible)
							.map(
								({_id, title, message, dismissible, status}) => 
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
const mapStateToProps = (state) => {
	return {
		messages: state.messages.items,
		showCookieMessage: !state.messages.cookiesAccepted
	};
};
// const mapDispatchToProps = (dispatch) => {
// 	return {
// 		onPersonalNumberBlur: (personalNumber) => {
// 			dispatch(validatePersonalNumber(personalNumber));
// 		} 
// 	};
// };

export default connect(mapStateToProps/*, mapDispatchToProps*/)(Messages);
