import fetch from 'isomorphic-fetch';
import { isValidPersonalNumber } from '../utils/personalNumber.js';

export const INPUT_PERSONAL_NUMBER = 'INPUT_PERSONAL_NUMBER';
export const SET_LOGIN_METHOD = 'SET_LOGIN_METHOD';
export const RESET_STATE = 'RESET_STATE';
export const SET_PERSONAL_NUMBER_VALIDITY = 'SET_PERSONAL_NUMBER_VALIDITY';

export const LoginMethod = {
    BANK_ID: 'BANK_ID',
    SITHS_CARD: 'SITHS_CARD',

};

export function setLoginMethod(loginMethod) {
    return {
        type: SET_LOGIN_METHOD,
        loginMethod
    };
}

export function resetState() {
	return {
		type: RESET_STATE
	};
}

//BankID actions
export const SET_BID_STAGE = 'SET_BID_STAGE';
export const SET_BID_STATUS = 'SET_BID_STATUS';
export const SET_BID_ORDER = 'SET_BID_ORDER';
export const BID_ERROR = 'BID_ERROR';
export const INCREMENT_BID_TRIES = 'INCREMENT_BID_TRIES';

export const LoginStages = {
	INPUT_PERSONAL_NUMBER: 'INPUT_PERSONAL_NUMBER',
	AWAIT_BID_TOKEN: 'AWAIT_BID_TOKEN',
	BID_COLLECT: 'BID_COLLECT',
	LOGIN_COMPLETED: 'LOGIN_COMPLETED',
	LOGIN_ERROR: 'LOGIN_ERROR'
};
export function inputPersonalNumber(personalNumber) {
    return {
        type: INPUT_PERSONAL_NUMBER,
        personalNumber
    };
}

export function setPersonalNumberValidity(validity) {
	return {
		type: SET_PERSONAL_NUMBER_VALIDITY,
		validity
	};
}

export function setBIDStage(bidStage) {
	return {
		type: SET_BID_STAGE,
		bidStage
	};
}

export function setBIDStatus(status) {
    return {
        type: SET_BID_STATUS,
        status
    };
}
function incrementBIDTries(){
	return {
		type: INCREMENT_BID_TRIES
	};
}

export function bidError(error) {
	return {
		type: BID_ERROR,
		error
	};
}
function receivedBIDToken(data) {
    return {
		type: SET_BID_ORDER,
		orderRef: data.orderRef,
		autoStartToken: data.autoStartToken
	};
}

export function validatePersonalNumber(personalNumber){
	return dispatch => {
		dispatch(setPersonalNumberValidity(isValidPersonalNumber(personalNumber)));	
	};
}

export function initiateBID(personalNumber) {
	return (dispatch, getState) => {
		const state = getState();
		if (state.login.personalNumberValidity) {
			dispatch(setBIDStage(LoginStages.AWAIT_BID_TOKEN));
			return dispatch(getToken(state.login.personalNumber));
		}
	};
}

export function getToken(personalNumber) {
    return dispatch => {
        return fetch(`https://stratum.registercentrum.se/api/authentication/bid/order/${personalNumber}`)
			.then(res => res.json())
            .then(json => {
				if(json.success){
					dispatch(receivedBIDToken(json.data));
					dispatch(setBIDStage(LoginStages.BID_COLLECT));
					return dispatch(collectBIDLogin(json.data.orderRef));
				} else {
					const error = new Error(json.message);
					dispatch(bidError(error));
					throw (error);
				}
			})
			.catch(error => { console.log('request failed', error); });
    };
}

function isBIDCompleted(state){
	return state.bankId.status === 'COMPLETE';
}

export function collectBIDLogin(orderRef) {
	return (dispatch, getState) => {
		return fetch(`https://stratum.registercentrum.se/api/authentication/bid/collect/${orderRef}`)
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(setBIDStatus(json.data));
					if (isBIDCompleted(getState())) {
						dispatch(setBIDStage(LoginStages.LOGIN_COMPLETED));
					} else {
						// Repeat call until completion, delay for 2 seconds
						dispatch(incrementBIDTries());
						return setTimeout(() => dispatch(collectBIDLogin(orderRef)), 2000);
					}
				} else {
					const error = new Error(json.message);
					dispatch(bidError(error));
					throw (error);
				}
			})
			.catch(error => { console.log('request failed', error); });
	}
}
