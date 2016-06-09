import fetch from 'isomorphic-fetch';
import { isValidPersonalNumber } from '../utils/personalNumber';

import { initiateBID } from './bankid';

import { contextError } from './context';

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

const { CLIENT_REGISTER_ID, CLIENT_STRATUM_SERVER, NODE_ENV } = process.env;

export function getKeystoneContext(isInitial){
	return (dispatch) => {
		dispatch(setContextLoadFlag(true));
		fetch('/api/authentication/context', { credentials: 'include' })
			.then(res => res.json())
			.then(json => {
				if(json.success){
					const { User, Unit } = json.data;
					dispatch(getAvailableContexts(json.data));
				} else {
					const error = new Error(json.message);
					throw (error);
				}
			})
			.catch(error => { 
				dispatch(setContextLoadFlag(false));
				if(!isInitial){
					console.log('request failed', error); 
				}
				dispatch(contextError(error));
			});
	};
}

export const SET_CONTEXT = 'SET_CONTEXT';

function setContext(context){
	return {
		type: SET_CONTEXT,
		context: context
	};
}

export function changeContext(roleId, unitId, contexts) {
	
	return (dispatch, getState) => {
		const context = contexts.find((c) => c.Unit.UnitID === unitId && c.Role.RoleID === roleId);
		if(!context){
			const err = new Error('Byte av roll misslyckades...');
			console.log(err);
			return dispatch(contextError(err));
		}
		return fetch(`${CLIENT_STRATUM_SERVER}/api/authentication/context`, {
			credentials: 'include',
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				Context: {
					ContextID: context.ContextID
				}
			})
		})
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(setContext(context));					
				} else {
					const error = new Error(json.message);
					throw (error);
				}
			})
			.catch(error => {
				console.log('request failed', error);
				contextError(error);
			});
	};
}


export function initLoginModal(){
	return (dispatch) => {
		const protocol = window.location.protocol === 'https:';
		dispatch(setCurrentProtocol(protocol));
		dispatch(resetState(true));
		if(!protocol && NODE_ENV !== 'development'){
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
		return fetch(`${CLIENT_STRATUM_SERVER}/api/authentication/login`, { credentials: 'include' })
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

export const LoginStages = {
	INPUT_PERSONAL_NUMBER: 'INPUT_PERSONAL_NUMBER',
	AWAIT_BID_TOKEN: 'AWAIT_BID_TOKEN',
	BID_COLLECT: 'BID_COLLECT',
	LOGIN_COMPLETED: 'LOGIN_COMPLETED',
	LOGIN_ERROR: 'LOGIN_ERROR',
	COOKIE_COLLECTED: 'COOKIE_COLLECTED'
};

export const SET_USER_INFO = 'SET_USER_INFO';

function setUserInfo(context, contexts, initial){
	return {
		type: SET_USER_INFO,
		wrongRegister: context.Unit.Register.RegisterID !== parseInt(CLIENT_REGISTER_ID),
		context: context,
		contexts: contexts,
		initial: !!initial
	};
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
            return 'Oväntat fel under identifiering.';
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
					dispatch(getAvailableContexts(json.data, true));
					// window.location.reload(); // For now...
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

export const CONTEXT_IS_LOADING = 'CONTEXT_IS_LOADING';

function setContextLoadFlag(isLoading){
	return {
		type: CONTEXT_IS_LOADING,
		isLoading: isLoading
	};
}

export function logoutFromStratum(){
	return dispatch => {
		return fetch(`${CLIENT_STRATUM_SERVER}/api/authentication/logout`, { credentials: 'include' })
			.then(res => res.json())
			.then(json =>{
				if(json.success){
					console.log('Logout successfull!');
				} else {
					throw new Error('Utloggning misslyckades...');
				}			
			})
			.catch(error => {
				dispatch(loginError(error));
			});
	};
}

function getAvailableContexts(context, initial){
	return dispatch => {
		return fetch(`${CLIENT_STRATUM_SERVER}/api/authentication/contexts`, {credentials: 'include'})
			.then(res => res.json())
			.then(json => {
				if(json.success){
					const contexts = json.data.filter(c => c.Unit.Register.RegisterID === parseInt(CLIENT_REGISTER_ID));
					if(contexts.length <= 0){
						//No matching contexts for this register counts as a failed login
						dispatch(logoutFromStratum());
						throw new Error('Du har tyvärr inte tillgång till det här registret.');
					} else {
						//Successful login
						dispatch(showLoginModal(false));
						dispatch(setUserInfo(context, contexts, initial));
						// window.location.reload(); // For now...			
					}
				}
			})
			.catch(error => {
				console.log('missing contexts', error);
				dispatch(loginError(error));
			});
	};
}
