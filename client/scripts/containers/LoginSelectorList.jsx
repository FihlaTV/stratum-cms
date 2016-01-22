import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoginMethod, setLoginMethod } from '../actions/actions';
import SelectLogin from '../components/SelectLogin.jsx';

const LoginSelectorList = ({
	onClick
}) => {
	return (
		<div className="login-method-list row">
			<SelectLogin logoClass="siths" onClick={onClick} loginMethod={LoginMethod.SITHS_CARD}>
				SITHS-Kort
			</SelectLogin>
			<SelectLogin logoClass="bankid" onClick={onClick} loginMethod={LoginMethod.BANK_ID} >
				Mobilt BankID
			</SelectLogin>
		</div>
	);
}

const mapStateToProps = (state) => {
	return {};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onClick: (method) => {
			dispatch(setLoginMethod(method));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginSelectorList);
