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
            return (
                <div>
                    <h1>Genomför synkning</h1>
                    <Spinner />
                    <p>{status}</p>
                </div>
            );
    }
}

const mapStateToProps = (state) => {
	return {
		personalNumber: state.login.personalNumber,
		validPNr: state.login.personalNumberValidity,
		stage: state.bankId.bidStage
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
