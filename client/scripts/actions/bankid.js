import fetch from 'isomorphic-fetch';
import { isValidPersonalNumber } from '../utils/personalNumber';
import { LoginStages, loginToStratum, setHasNextState, loginError } from './login';

// BankID actions
export const INPUT_PERSONAL_NUMBER = 'INPUT_PERSONAL_NUMBER';
export const SET_PERSONAL_NUMBER_VALIDITY = 'SET_PERSONAL_NUMBER_VALIDITY';
export const SET_BID_STAGE = 'SET_BID_STAGE';
export const SET_BID_STATUS = 'SET_BID_STATUS';
export const SET_BID_ORDER = 'SET_BID_ORDER';
export const INCREMENT_BID_TRIES = 'INCREMENT_BID_TRIES';
export const SET_USER_NAME = 'SET_USER_NAME';

export function inputPersonalNumber (personalNumber) {
	return {
		type: INPUT_PERSONAL_NUMBER,
		personalNumber,
	};
}

export function setUserName (userName) {
	return {
		type: SET_USER_NAME,
		userName,
	};
}

export function setPersonalNumberValidity (validity) {
	return {
		type: SET_PERSONAL_NUMBER_VALIDITY,
		validity,
	};
}

export function setBIDStage (bidStage) {
	return {
		type: SET_BID_STAGE,
		bidStage,
	};
}

export function setBIDStatus (status) {
	return {
		type: SET_BID_STATUS,
		status,
	};
}
function incrementBIDTries () {
	return {
		type: INCREMENT_BID_TRIES,
	};
}

function receivedBIDToken (data) {
	return {
		type: SET_BID_ORDER,
		orderRef: data.orderRef,
		autoStartToken: data.autoStartToken,
	};
}

export function validatePersonalNumber (personalNumber) {
	return dispatch => {
		const valid = isValidPersonalNumber(personalNumber);

		dispatch(setPersonalNumberValidity(valid));
		if (valid) {
			// Strip dash
			dispatch(inputPersonalNumber(personalNumber.replace('-', '')));
		}
	};
}

export function initiateBID () {
	return (dispatch, getState) => {
		const state = getState();
		if (state.bankId.personalNumberValidity) {
			dispatch(setHasNextState(false));
			dispatch(setBIDStage(LoginStages.AWAIT_BID_TOKEN));
			return dispatch(getToken(state.bankId.personalNumber));
		}
	};
}

export function getToken (personalNumber) {
	return dispatch => {
		return fetch(`/stratum/api/authentication/bid/order/${personalNumber}?_=${(new Date()).getTime()}`, { credentials: 'include' })
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(receivedBIDToken(json.data));
					dispatch(setBIDStage(LoginStages.BID_COLLECT));
					return dispatch(collectBIDLogin(json.data.orderRef));
				} else {
					const error = new Error(getBIDErrorMessage(json.message));
					throw (error);
				}
			})
			.catch(error => {
				console.log('request failed', error);
				dispatch(loginError(error));
			});
	};
}

function getBIDErrorMessage (errorCode) {
	switch (errorCode) {
		case 'EXPIRED_TRANSACTION':
			return 'Du tog för lång tid på dig. Börja om från början.';
		case 'ALREADY_IN_PROGRESS':
			return 'En synkronisering mot Mobilt BankID med ditt personnummer är redan initierad försök igen om ett par minuter';
		case 'INVALID_PARAMETERS':
		default:
			return 'Det har uppstått något problem med tjänsten Mobilt BankID. Försök igen.';
	}
}

function shouldContinueCollect (state) {
	return state.bankId.bidStage === LoginStages.BID_COLLECT;
}
function isBIDCompleted (state) {
	return state.bankId.status === 'COMPLETE';
}

export function collectBIDLogin (orderRef) {
	return (dispatch, getState) => {
		return fetch(`/stratum/api/authentication/bid/collect/${orderRef}?_=${(new Date()).getTime()}`, { credentials: 'include' })
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(setBIDStatus(json.data));
					if (isBIDCompleted(getState())) {
						dispatch(setBIDStage(LoginStages.COOKIE_COLLECTED));
						dispatch(loginToStratum());
					} else if (shouldContinueCollect(getState())) {
						// Repeat call until completion, delay for 2 seconds
						dispatch(incrementBIDTries());
						return setTimeout(() => dispatch(collectBIDLogin(orderRef)), 2000);
					}
				} else {
					const error = new Error(getBIDErrorMessage(json.message));
					throw (error);
				}
			})
			.catch(error => {
				dispatch(loginError(error));
				console.log('request failed', error);
			});
	};
}
