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
    SITHS_CARD: 'SITHS_CARD'
};

export function getKeystoneContext(){
	return (dispatch) => {
		fetch('/api/authentication/context', { credentials: 'include' })
			.then(res => res.json())
			.then(json => {
				if(json.success){
					const { User, Unit } = json.data;
					if(Unit.Register.RegisterID !== process.env.CLIENT_REGISTER_ID){
						
					}
					// return dispatch(loginToStratum());
					dispatch(setUserInfo(json.data));
					
				} else {
					const error = new Error(json.message);
					throw (error);
				}
			})
			.catch(error => { 
				console.log('request failed', error); 
				// dispatch(loginError(error));
			});
	};
}

export function initLoginModal(){
	return (dispatch) => {
		const protocol = window.location.protocol === 'https:';
		dispatch(setCurrentProtocol(protocol));
		dispatch(resetState(true));
		if(!protocol && process.env.NODE_ENV !== 'development'){
			dispatch(loginError(new Error('Det går inte att logga in pga att du inte besöker webbplatsen över https. Var god försök igen under https.')));
		}
		return dispatch(showLoginModal(true));
	};
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

function sithsErrorMessages(errorCode){
	switch(errorCode) {
		case 3: // TODO: Look further into these error codes and see if they match
		case 4:
            return `Ditt SITHS-kort kunde identifieras, 
                men du har inte behörighet att gå in i registret. 
                Kontakta registrets support.`;
		case 9: //Kontextfel?
		case 1:
		default:
			return `Ditt SITHS-kort kunde inte identifieras. 
                Pröva att stänga browsern. Sätt i SITHS-kortet. 
                Öppna browsern igen och gå till registrets webbplats.`;
	}
}

/**	
 * Does a call directly to stratum from the client in order to be able to send 
 * client certificates and retreive a stratum cookie
 */
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
					const error = new Error(json.code ? sithsErrorMessages(json.code) : json.message);
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
	};
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

export const SET_USER_INFO = 'SET_USER_INFO';

function setUserInfo(json){
	const { User, Role, Unit } = json;
	return {
		type: SET_USER_INFO,
		user: User,
		role: Role,
		unit: Unit
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

function getBIDErrorMessage(errorCode){
    switch (errorCode){
        case 'EXPIRED_TRANSACTION': 
            return 'Du tog för lång tid på dig. Börja om från början.';
        case 'ALREADY_IN_PROGRESS': 
            return 'En synkronisering mot Mobilt BankID med ditt personnummer är redan initierad försök igen om ett par minuter';
        case 'INVALID_PARAMETERS':
        default:
            return 'Det har uppstått något problem med tjänsten Mobilt BankID. Försök igen.';
    }
}

/**
 * Returns explainatory texts for the errorcodes returned by the 
 * proxied login call. 
 */
function getStratumProxyLoginError(errorCode){
    switch (errorCode){
        case 'CONTEXT_ERROR':
            return `Din inloggning kunde identifieras, 
                men du har inte behörighet att gå in i registret. 
                Kontakta registrets support.`;
        default:
            return `Oväntat fel under identifiering.`;
    }
}

/**
 * Does the actual login to stratum once the cookie has been received 
 * from stratum. This call is handled by a proxy in Keystone and not by 
 * stratum directly, in order to read the cookie.
 */
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
					const error = new Error(json.code ? getStratumProxyLoginError(json.code) : json.message);
					throw (error);
				}
			})
			.catch(error => { 
				console.log('request failed', error); 
				dispatch(loginError(error));
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
					const error = new Error(getBIDErrorMessage(json.message));
					throw (error);
				}
			})
			.catch(error => { 
				dispatch(loginError(error));
				console.log('request failed', error); 
			});
	}
}
