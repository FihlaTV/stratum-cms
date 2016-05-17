import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inputPersonalNumber, validatePersonalNumber, initiateBID } from '../actions/bankid';
import { LoginStages } from '../actions/login';
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
                    <InputPersonalNr onChange={onPersonalNumberBlur} onSubmit={onSubmit} valid={validPNr}/>
                </div>
            );
        case LoginStages.AWAIT_BID_TOKEN:
		case LoginStages.BID_COLLECT:
		case LoginStages.COOKIE_COLLECTED:
            return (
                <div>
                    <Spinner />
                    <BIDStatusMessage statusCode={status}/>
                </div>
            );
		case LoginStages.LOGIN_COMPLETED:
			return (
				<div>
					<p>Inloggning genomförd</p>
					Inloggad som <strong>{userName}</strong>
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
			dispatch(validatePersonalNumber(personalNumber));
		} 
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BankID);
