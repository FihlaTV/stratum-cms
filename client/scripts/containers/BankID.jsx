import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inputPersonalNumber, validatePersonalNumber, initiateBID } from '../actions/actions';
import InputPersonalNr from '../components/InputPersonalNr.jsx';
import SelectLogin from '../components/SelectLogin.jsx';

const BankID = ({
	onSubmit,
	personalNumber,
	stage,
	validPNr
}) => {
	return (
		<div>
			<h1>Bank ID <small>{personalNumber}</small></h1>
			<InputPersonalNr onSubmit={onSubmit} valid={validPNr}/>
			<h2>{stage}</h2>
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		personalNumber: state.login.personalNumber,
		validPNr: state.login.personalNumberValidity,
		stage: state.bankId.loginStage
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onSubmit: (personalNumber) => {
			dispatch(inputPersonalNumber(personalNumber));
			dispatch(validatePersonalNumber(personalNumber));
			dispatch(initiateBID(personalNumber));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BankID);
