import es6Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import { isValidPersonalNumber } from '../utils/personalNumber';
es6Promise.polyfill();

export const SET_LOGIN_METHOD = 'SET_LOGIN_METHOD';
export const RESET_STATE = 'RESET_STATE';
export const HAS_NEXT_STATE = 'HAS_NEXT_STATE';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const SHOW_LOGIN_MODAL = 'SHOW_LOGIN_MODAL';
export const SET_HTTPS_FLAG = 'SET_HTTPS_FLAG';

export const LoginMethod = {
    BANK_ID: 'BANK_ID',
    SITHS_CARD: 'SITHS_CARD',

};

export function initLoginModal(){
	return (dispatch) => {
		dispatch(setCurrentProtocol(window.location.protocol === 'https:'));
		dispatch(resetState(true));
		return dispatch(showLoginModal(true));
	}
}

export function setCurrentProtocol(isHTTPS){
	return {
		type: SET_HTTPS_FLAG,
		https: isHTTPS
	};
}

export function showLoginModal(show){
	return {
		type: SHOW_LOGIN_MODAL,
		showLoginModal: show
	};
}

export function setLoginMethod(loginMethod) {
    return {
        type: SET_LOGIN_METHOD,
        loginMethod
    };
}

export function resetState(closeModal) {
	return {
		type: RESET_STATE,
		close: closeModal
	};
}


export function setHasNextState(hasNextState){
	return {
		type: HAS_NEXT_STATE,
		hasNextState: hasNextState
	};
}

export function loginError(error) {
	return {
		type: LOGIN_ERROR,
		error
	};
}

// SITHS actions

export const SET_SITHS_STATUS = 'SET_SITHS_STATUS'; 
export const SITHSStages = {
	INFORM: 'INFORM',
	DO_LOGIN: 'DO_LOGIN'
};

export function setSITHSStatus(sithsStatus){
	return {
		type: SET_SITHS_STATUS,
		sithsStatus: sithsStatus
	};
}

export function initiateSITHSLogin(){
	return (dispatch) => {
		dispatch(setHasNextState(false));
		dispatch(setSITHSStatus('SITHS_DO_LOGIN'));
		return fetch(`${process.env.CLIENT_STRATUM_SERVER}/api/authentication/login`, { credentials: 'include' })
			.then(res => res.json())
			.then(json => {
				if(json.success){
					return dispatch(loginToStratum());
				} else {
					const error = new Error(json.message);
					throw (error);
				}
			})
			.catch(error => { 
				console.log('request failed', error); 
				dispatch(loginError(error));
			});
	};
}

export function toggleNextState(){
	return (dispatch, getState) => {
		const state = getState();
		const loginMethod = state.login.loginMethod;
		if (loginMethod === LoginMethod.SITHS_CARD) {
			return dispatch(initiateSITHSLogin());
		} else if (loginMethod === LoginMethod.BANK_ID &&
			state.bankId.bidStage === LoginStages.INPUT_PERSONAL_NUMBER &&
			state.bankId.personalNumberValidity) {
			return dispatch(initiateBID());
		}
	}
}

//BankID actions
export const INPUT_PERSONAL_NUMBER = 'INPUT_PERSONAL_NUMBER';
export const SET_PERSONAL_NUMBER_VALIDITY = 'SET_PERSONAL_NUMBER_VALIDITY';
export const SET_BID_STAGE = 'SET_BID_STAGE';
export const SET_BID_STATUS = 'SET_BID_STATUS';
export const SET_BID_ORDER = 'SET_BID_ORDER';
export const INCREMENT_BID_TRIES = 'INCREMENT_BID_TRIES';
export const SET_USER_NAME = 'SET_USER_NAME';

export const LoginStages = {
	INPUT_PERSONAL_NUMBER: 'INPUT_PERSONAL_NUMBER',
	AWAIT_BID_TOKEN: 'AWAIT_BID_TOKEN',
	BID_COLLECT: 'BID_COLLECT',
	LOGIN_COMPLETED: 'LOGIN_COMPLETED',
	LOGIN_ERROR: 'LOGIN_ERROR',
	COOKIE_COLLECTED: 'COOKIE_COLLECTED'
};
export function inputPersonalNumber(personalNumber) {
    return {
        type: INPUT_PERSONAL_NUMBER,
        personalNumber
    };
}

export function setUserName(userName){
	return {
		type: SET_USER_NAME,
		userName
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

function receivedBIDToken(data) {
    return {
		type: SET_BID_ORDER,
		orderRef: data.orderRef,
		autoStartToken: data.autoStartToken
	};
}

export function validatePersonalNumber(personalNumber){
	return dispatch => {
		const valid = isValidPersonalNumber(personalNumber);
		
		dispatch(setPersonalNumberValidity(valid));
		if(valid){
			dispatch(inputPersonalNumber(personalNumber));
		}	
	};
}

function bidLoginError(error){
	return dispatch => {
		dispatch(loginError(error));
	};
}

export function initiateBID() {
	return (dispatch, getState) => {
		const state = getState();
		if (state.bankId.personalNumberValidity) {
			dispatch(setHasNextState(false));
			dispatch(setBIDStage(LoginStages.AWAIT_BID_TOKEN));
			return dispatch(getToken(state.bankId.personalNumber));
		}
	};
}

export function getToken(personalNumber) {
    return dispatch => {
        return fetch(`/stratum/api/authentication/bid/order/${personalNumber}`, { credentials: 'include' })
			.then(res => res.json())
            .then(json => {
				if(json.success){
					dispatch(receivedBIDToken(json.data));
					dispatch(setBIDStage(LoginStages.BID_COLLECT));
					return dispatch(collectBIDLogin(json.data.orderRef));
				} else {
					const error = new Error(json.message);
					throw (error);
				}
			})
			.catch(error => { 
				console.log('request failed', error); 
				dispatch(bidLoginError(error));
			});
    };
}

export function loginToStratum(){
	return dispatch => {
		return fetch('/api/authentication/login', { credentials: 'include' })
			.then(res => res.json())
			.then(json => {
				if(json.success){
					window.location.reload(); // For now...
					// dispatch(setUserName(`${json.data.User.FirstName} ${json.data.User.LastName}`));
					// return dispatch(setBIDStage(LoginStages.LOGIN_COMPLETED));
				} else {
					const error = new Error(json.message);
					throw (error);
				}
			})
			.catch(error => { 
				console.log('request failed', error); 
				dispatch(bidLoginError(error));
			});
	};
}

function shouldContinueCollect(state){
	return state.bankId.bidStage === LoginStages.BID_COLLECT;
}
function isBIDCompleted(state){
	return state.bankId.status === 'COMPLETE';
}

export function collectBIDLogin(orderRef) {
	return (dispatch, getState) => {
		return fetch(`/stratum/api/authentication/bid/collect/${orderRef}`, { credentials: 'include' })
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(setBIDStatus(json.data));
					if (isBIDCompleted(getState())) {
						dispatch(setBIDStage(LoginStages.COOKIE_COLLECTED));
						dispatch(loginToStratum());
					} else if(shouldContinueCollect(getState())) {
						// Repeat call until completion, delay for 2 seconds
						dispatch(incrementBIDTries());
						return setTimeout(() => dispatch(collectBIDLogin(orderRef)), 2000);
					}
				} else {
					const error = new Error(json.message);
					throw (error);
				}
			})
			.catch(error => { 
				dispatch(bidLoginError(error));
				console.log('request failed', error); 
			});
	}
}
