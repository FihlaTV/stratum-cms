import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { } from '../actions/messages';
import Spinner from '../components/Spinner';

const Messages = ({
	messages
}) => {
    return (
		<h1>Messages</h1>
	);
};

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
