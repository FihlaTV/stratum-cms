import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchMessages, showMessage, initMessages, acceptCookie } from '../actions/messages';
import Spinner from '../components/Spinner';
import Message from '../components/Message';
import CookieMessage from '../components/CookieMessage';
import { Button } from 'react-bootstrap';

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
				<CookieMessage visible={showCookieMessage} onDismiss={
						() => dispatch(acceptCookie())
					}
				/>
				{
					messages.map(
						({_id, title, message, dismissible, status, visible}) => 
						<Message key={_id} id={_id} title={title} text={message} status={status} onDismiss={
							dismissible ? (id) => dispatch(showMessage(id, false)) : null 
						} visible={visible}/>
					)
				}
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
