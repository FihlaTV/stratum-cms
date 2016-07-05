import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchMessages, showMessage } from '../actions/messages';
import Spinner from '../components/Spinner';
import Message from '../components/Message';

class Messages extends Component {
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(fetchMessages());
	}
	render() {
		const {
			messages = [],
			dispatch
		} = this.props;

		return (<div>{
			messages.map((
				{_id, title, message, dismissible, status, visible}) => 
				<Message key={_id} id={_id} title={title} text={message} status={status} onDismiss={
					dismissible ? (id) => dispatch(showMessage(id, false)) : null 
				} visible={visible}/>
				)
		}</div>);
	}
}
const mapStateToProps = (state) => {
	return {
		messages: state.messages.items
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
