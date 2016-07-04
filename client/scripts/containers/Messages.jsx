import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchMessages } from '../actions/messages';
import Spinner from '../components/Spinner';
import Message from '../components/Message';

class Messages extends Component {
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(fetchMessages());
	}
	render() {
		const {
			messages = []
		} = this.props;

		return (<div>{
			messages.map(({id, title, message, dismissible}) => <Message id={id} title={title} text={message} dismissible={dismissible}/>)
		}</div>);
	}
}
const mapStateToProps = (state) => {
	return {
		messages: state.messages.messages
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
