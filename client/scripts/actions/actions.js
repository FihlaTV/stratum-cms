// import moment from 'moment';

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
		if (!matches ) { //|| !moment(century + matches.slice(3, 6).join('-')).isValid()) {
			return dispatch(setPersonalNumberValidity(false));
		}
		return dispatch(setPersonalNumberValidity(isValidSwedishPIN(matches[2])));
	}
}


//BankID actions
export const SET_BID_STAGE = 'SET_BID_STAGE';

export const LoginStages = {
	INPUT_PERSONAL_NUMBER: 'INPUT_PERSONAL_NUMBER',
	AWAIT_BID_INIT: 'AWAIT_BID_INIT'
};

export function setBIDStage(bidStage){
	return {
		type: SET_BID_STAGE,
		bidStage
	}
}

export function initiateBID(personalNumber) {
	return (dispatch, state) => {
		if(state.login.validPersonalNumber) {
			return dispatch(setBIDStage(LoginStages.AWAIT_BID_INIT));
		}
	}
}