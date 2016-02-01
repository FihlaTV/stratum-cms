import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoginStages, inputPersonalNumber, validatePersonalNumber, initiateBID } from '../actions/actions';
import InputPersonalNr from '../components/InputPersonalNr.jsx';
import SelectLogin from '../components/SelectLogin.jsx';
import Spinner from '../components/Spinner.jsx';

const BankID = ({
	onSubmit,
	personalNumber,
	stage,
    status,
	orderRef,
	error,
	validPNr
}) => {
    switch (stage) {
        case LoginStages.INPUT_PERSONAL_NUMBER:
            return (
                <div>
                    <h1>Bank ID <small>{personalNumber}</small></h1>
                    <InputPersonalNr onSubmit={onSubmit} valid={validPNr}/>
                    <h2>{stage}</h2>
                </div>
            );
        case LoginStages.AWAIT_BID_TOKEN:
		case LoginStages.BID_COLLECT:
            return (
                <div>
                    <h1>Genomför synkning</h1>
                    <Spinner />
                    <p>{status}</p>
					<p>{orderRef}</p>
					<p>{error && error.message}</p>
                </div>
            );
		case LoginStages.LOGIN_COMPLETED:
			return (
				<div>
					<h1>Inloggning genomförd</h1>
				</div>
			);
		case LoginStages.LOGIN_ERROR:
			return (
				<div>
					<h1>Fel!</h1>
					<p>{error && error.message}</p>
				</div>
			);
		default:
			return (
				<div>
				 Ok?
				</div>
			);
    }
}

const mapStateToProps = (state) => {
	return {
		personalNumber: state.login.personalNumber,
		validPNr: state.login.personalNumberValidity,
		stage: state.bankId.bidStage,
		orderRef: state.bankId.orderRef,
		status: state.bankId.status,
		error: state.bankId.error
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
