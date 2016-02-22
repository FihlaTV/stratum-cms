import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoginStages, inputPersonalNumber, validatePersonalNumber, initiateBID } from '../actions/actions';
import InputPersonalNr from '../components/InputPersonalNr';
import SelectLogin from '../components/SelectLogin';
import BIDStatusMessage from '../components/BIDStatusMessage';
import Spinner from '../components/Spinner';

const BankID = ({
	onSubmit,
    onPersonalNumberBlur,
	personalNumber,
	stage,
    status,
	orderRef,
	error,
	userName,
	validPNr
}) => {
    switch (stage) {
        case LoginStages.INPUT_PERSONAL_NUMBER:
            return (
                <div>
                    <h1>Bank ID</h1>
                    <InputPersonalNr onChange={onPersonalNumberBlur} onSubmit={onSubmit} valid={validPNr}/>
                </div>
            );
        case LoginStages.AWAIT_BID_TOKEN:
		case LoginStages.BID_COLLECT:
		case LoginStages.COOKIE_COLLECTED:
            return (
                <div>
                    <h1>Genomför synkning</h1>
                    <Spinner />
                    <BIDStatusMessage status={status}/>
                </div>
            );
		case LoginStages.LOGIN_COMPLETED:
			return (
				<div>
					<h1>Inloggning genomförd</h1>
					Inloggad som <strong>{userName}</strong>
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
				?
				</div>
			);
    }
}

const mapStateToProps = (state) => {
	return {
		personalNumber: state.bankId.personalNumber,
		validPNr: state.bankId.personalNumberValidity,
		stage: state.bankId.bidStage,
		orderRef: state.bankId.orderRef,
		status: state.bankId.status,
		userName: state.bankId.userName,
		error: state.bankId.error
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onPersonalNumberBlur: (personalNumber) => {
			dispatch(inputPersonalNumber(personalNumber));
			dispatch(validatePersonalNumber(personalNumber));
		} 
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BankID);
