import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inputPersonalNumber } from '../actions/actions';
import InputPersonalNr from '../components/InputPersonalNr.jsx';
import SelectLogin from '../components/SelectLogin.jsx';

const BankID = ({
	onSubmit,
	personalNumber
}) => {
	return (
		<div>
			<h1>Bank ID <small>{personalNumber}</small></h1>
			<InputPersonalNr onSubmit={onSubmit}/>
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		personalNumber: state.login.personalNumber
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onSubmit: (personalNumber) => {
			dispatch(inputPersonalNumber(personalNumber));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BankID);
