import fetch from 'isomorphic-fetch';

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

export function resetState() {
	return {
		type: RESET_STATE
	};
}

function isValidSwedishPIN(pin) {
	pin = pin
		.replace(/\D/g, '') // strip out all but digits
		.split('') // convert string to array
		.reverse() // reverse order for Luhn
		.slice(0, 10); // keep only 10 digits (i.e. 1977 becomes 77)

	// verify we got 10 digits, otherwise it is invalid
	if (pin.length !== 10) {
		return false;
	}
	var sum = pin
	// convert to number
		.map(function (n) {
			return Number(n);
		})
	// perform arithmetic and return sum
		.reduce(function (previous, current, index) {
			// multiply every other number with two
			if (index % 2) {
				current *= 2;
			}
			// if larger than 10 get sum of individual digits (also n-9)
			if (current > 9) {
				current -= 9;
			}
			// sum it up
			return previous + current;
		});

	// sum must be divisible by 10
	return 0 === sum % 10;
}

export function validatePersonalNumber(personalNumber) {
	return dispatch => {
		var matches = personalNumber
			.replace('-', '')
			.trim()
			.match(/^(\d\d){0,1}((\d{2})(\d{2})(\d{2})\d{4})$/);
		var century = matches && matches[1] || '19';
		if (!matches) { //|| !moment(century + matches.slice(3, 6).join('-')).isValid()) {
			return dispatch(setPersonalNumberValidity(false));
		}
		return dispatch(setPersonalNumberValidity(isValidSwedishPIN(matches[2])));
	}
}

function receivedBIDToken(data) {
    return {
		type: SET_BID_ORDER,
		orderRef: data.orderRef,
		autoStartToken: data.autoStartToken
	};
}

function shouldContinueBIDCollect(state){
	return state.bankId.bidStage === 'BID_COLLECT';
}

function isBIDCompleted(state){
	return state.bankId.status === 'COMPLETE';
}

function incrementBIDTries(){
	return {
		type: INCREMENT_BID_TRIES
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

export function bidError(error) {
	return {
		type: BID_ERROR,
		error
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

export function collectBIDLogin(orderRef) {
	return (dispatch, getState) => {
		return fetch(`https://stratum.registercentrum.se/api/authentication/bid/collect/${orderRef}`)
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					const state = getState();
					dispatch(setBIDStatus(json.data));
					if (isBIDCompleted(state)) {
						dispatch(setBIDStage(LoginStages.LOGIN_COMPLETED));
					} else if(shouldContinueBIDCollect(state)){
						// Repeat call until completion
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