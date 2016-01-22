import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoginMethod, setLoginMethod } from '../actions/actions';
import InputPersonalNr from '../components/InputPersonalNr.jsx';
import SelectLogin from '../components/SelectLogin.jsx';

const BankID = ({
	onClick
}) => {
	return (
		<div>
			<h1>Bank ID</h1>
			<InputPersonalNr onSubmit={x => dispatch(inputPersonalNumber(x))}/>
		</div>
	);
}

const mapStateToProps = (state) => {
	return {};
};
const mapDispatchToProps = (dispatch) => {
	return {
		// onClick: (method) => {
		// 	dispatch(setLoginMethod(method));
		// }
	};
};

export default connect()(BankID);
