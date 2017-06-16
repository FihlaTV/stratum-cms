import fetch from 'isomorphic-fetch';
import cookies from 'js-cookie';

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
	SITHS_CARD: 'SITHS_CARD',
};

const { CLIENT_REGISTER_ID, CLIENT_STRATUM_SERVER, NODE_ENV, CLIENT_DEMO_USERNAME, CLIENT_DEMO_PASSWORD = 'demo' } = process.env;

export function getKeystoneContext (isInitial) {
	return (dispatch) => {
		dispatch(setContextLoadFlag(true));
		fetch(`/api/authentication/context?_=${(new Date()).getTime()}`, {
			credentials: 'include',
		})
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(getAvailableContexts(json.data));
				} else {
					const error = new Error(json.message);
					throw (error);
				}
			})
			.catch(error => {
				dispatch(setContextLoadFlag(false));
				if (!isInitial) {
					console.log('request failed', error);
				}
				dispatch(contextError(error));
			});
	};
}

export const SET_CONTEXT = 'SET_CONTEXT';

function setContext (context) {
	return {
		type: SET_CONTEXT,
		context: context,
	};
}

export function changeContext (roleId, unitId, contexts) {

	return (dispatch, getState) => {
		const context = contexts.find((c) => c.Unit.UnitID === unitId && c.Role.RoleID === roleId);
		if (!context) {
			const err = new Error('Byte av roll misslyckades...');
			console.log(err);
			return dispatch(contextError(err));
		}
		dispatch(setContextLoadFlag(true));
		return fetch(`/stratum/api/authentication/context?_=${(new Date()).getTime()}`, {
			credentials: 'include',
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				Context: {
					ContextID: context.ContextID,
				},
			}),
		})
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					// Stratum Update
					if (location.pathname !== '/registrering') {
						window.location.reload();
					}

					if (typeof window.assignProfileContext !== 'undefined') {
						window.assignProfileContext(context);
					}
					dispatch(setContext(context));
					dispatch(setContextLoadFlag(false));
				} else {
					const error = new Error(json.message);
					throw (error);
				}
			})
			.catch(error => {
				dispatch(setContextLoadFlag(false));
				console.log('request failed', error);
				contextError(error);
			});
	};
}


export function initLoginModal () {
	return (dispatch) => {
		const protocol = window.location.protocol === 'https:';
		dispatch(setCurrentProtocol(protocol));
		dispatch(resetState(true));
		if (CLIENT_DEMO_USERNAME) {
			return dispatch(assignSithsCard({ username: CLIENT_DEMO_USERNAME, password: CLIENT_DEMO_PASSWORD, timeout: 0 }));
		}
		if (!protocol && NODE_ENV !== 'development') {
			dispatch(loginError(new Error('Det går inte att logga in pga att du inte besöker webbplatsen över https. Var god försök igen under https.')));
		}
		return dispatch(showLoginModal(true));
	};
}

export function setCurrentProtocol (isHTTPS) {
	return {
		type: SET_HTTPS_FLAG,
		https: isHTTPS,
	};
}

export function showLoginModal (show) {
	return {
		type: SHOW_LOGIN_MODAL,
		showLoginModal: show,
	};
}

export function setLoginMethod (loginMethod) {
	return {
		type: SET_LOGIN_METHOD,
		loginMethod,
	};
}

export function resetState (closeModal) {
	return {
		type: RESET_STATE,
		close: closeModal,
	};
}


export function setHasNextState (hasNextState) {
	return {
		type: HAS_NEXT_STATE,
		hasNextState: hasNextState,
	};
}

export function loginError (error) {
	return {
		type: LOGIN_ERROR,
		error,
	};
}

// SITHS actions

export const SET_SITHS_STATUS = 'SET_SITHS_STATUS';
export const SITHSStages = {
	INFORM: 'INFORM',
	DO_LOGIN: 'DO_LOGIN',
};

export function setSITHSStatus (sithsStatus) {
	return {
		type: SET_SITHS_STATUS,
		sithsStatus: sithsStatus,
	};
}

function sithsErrorMessages (errorCode) {
	switch (errorCode) {
		case 3: // TODO: Look further into these error codes and see if they match
		case 4:
			return `Ditt SITHS-kort kunde identifieras,
				men du har inte behörighet att gå in i registret.
				Kontakta registrets support.`;
		case 9: // Kontextfel?
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
export function initiateSITHSLogin () {
	return (dispatch) => {
		dispatch(setHasNextState(false));
		dispatch(setSITHSStatus('SITHS_DO_LOGIN'));
		return fetch(`${CLIENT_STRATUM_SERVER}/api/authentication/login?_=${(new Date()).getTime()}`, {
			credentials: 'include',
		})
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					return dispatch(loginToStratum());
				} else if (json.code === 3 || json.code === 4) {
					// Ask if new card should be attached to User
					dispatch(setHasNextState(true));
					return dispatch(setSITHSStatus('SITHS_NEW_CARD'));
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

export function toggleNextState () {
	return (dispatch, getState) => {
		const state = getState();
		const loginMethod = state.login.loginMethod;
		if (loginMethod === LoginMethod.SITHS_CARD) {
			if (state.login.sithsStatus === 'SITHS_NEW_CARD') {
				// Dispatch assign card call
				if (state.login.sithsNewCard.valid) {
					// console.log('valid');
					dispatch(setHasNextState(false));
					dispatch(setSITHSStatus('SITHS_DO_LOGIN')); // Set loading status
					dispatch(assignSithsCard(state.login.sithsNewCard));
				}
			} else {
				return dispatch(initiateSITHSLogin());
			}
		} else if (loginMethod === LoginMethod.BANK_ID
			&& state.bankId.bidStage === LoginStages.INPUT_PERSONAL_NUMBER
			&& state.bankId.personalNumberValidity) {
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
	COOKIE_COLLECTED: 'COOKIE_COLLECTED',
};

export const SET_USER_INFO = 'SET_USER_INFO';

function setUserInfo (context, contexts, initial) {
	const wrongRegister = context.Unit.Register.RegisterID !== parseInt(CLIENT_REGISTER_ID);
	return {
		type: SET_USER_INFO,
		wrongRegister: wrongRegister,
		context: wrongRegister ? undefined : context,
		contexts: contexts,
		initial: !!initial,
	};
}

/**
 * Returns explainatory texts for the errorcodes returned by the
 * proxied login call.
 */
function getStratumProxyLoginError (errorCode) {
	switch (errorCode) {
		case 'CONTEXT_ERROR':
			return `Din inloggning kunde identifieras,
				men du har inte behörighet att gå in i registret.
				Kontakta registrets support.`;
		case 'ASSIGN_WRONG_CREDENTIALS':
			return 'Fel användarnamn och/eller lösenord, var god försök igen...';
		default:
			return 'Oväntat fel under identifiering.';
	}
}

/**
 * Does the actual login to stratum once the cookie has been received
 * from stratum. This call is handled by a proxy in Keystone and not by
 * stratum directly, in order to read the cookie.
 */
export function loginToStratum (refresh) {
	return dispatch => {
		return fetch(`/api/authentication/login?_=${(new Date()).getTime()}`, {
			credentials: 'include',
		})
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					if (!refresh) {
						dispatch(getAvailableContexts(json.data, true, true));
					}
					dispatch(setTimeleft(30 * 60));
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

function assignSithsCard ({ username, password, timeout = 5000 } = {}) {
	return dispatch => {
		return fetch(`${CLIENT_STRATUM_SERVER}/api/authentication/assign?_=${(new Date()).getTime()}&username=${username}&password=${password}`, {
			credentials: 'include',
		})
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					console.log('login with new siths card successful...');
					dispatch(setSITHSStatus('SITHS_NEW_CARD_COMPLETE'));
					setTimeout(() => window.location.reload(), timeout); // For now...
				} else {
					const errorCode = json.code === 1 && 'ASSIGN_WRONG_CREDENTIALS';
					const error = new Error(getStratumProxyLoginError(errorCode));
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

function setContextLoadFlag (isLoading) {
	return {
		type: CONTEXT_IS_LOADING,
		isLoading: isLoading,
	};
}

export function logoutFromStratum () {
	return dispatch => {
		return fetch(`${CLIENT_STRATUM_SERVER}/api/authentication/logout?_=${(new Date()).getTime()}`, {
			credentials: 'include',
		})
			.then(res => res.json())
			.then(json => {
				if (json.success) {
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

function getAvailableContexts (context, initial, isLogin) {
	return dispatch => {
		return fetch(`${CLIENT_STRATUM_SERVER}/api/authentication/contexts?_=${(new Date()).getTime()}`, {
			credentials: 'include',
		})
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					const contexts = json.data.filter(c => c.Unit.Register.RegisterID === parseInt(CLIENT_REGISTER_ID));
					if (contexts.length <= 0) {
						// No matching contexts for this register counts as a failed login
						dispatch(setContextLoadFlag(false));
						if (isLogin) {
							dispatch(logoutFromStratum());
						}
						throw new Error('Du har tyvärr inte tillgång till det här registret.');
					} else {
						// Successful login
						dispatch(checkTimeleft(60 * 1000));
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

export const SET_TIMELEFT = 'SET_TIMELEFT';

function setTimeleft (timeleft, show) {
	return {
		type: SET_TIMELEFT,
		timeleft: timeleft,
		showTimeleft: typeof show !== 'undefined' ? show : (timeleft < 3 * 60),
	};
}

export function dismissTimeleft (timeleft) {
	return dispatch => {
		if (timeleft > 0) {
			dispatch(loginToStratum(true));
		}
		else {
			// Force logout if time has run out
			dispatch(setTimeleft(timeleft, false));
			window.location.replace('/logout');
		}
	};
}

export const SET_ACTIVE_STATUS = 'SET_ACTIVE_STATUS';

function setActiveStatus (active) {
	return {
		type: SET_ACTIVE_STATUS,
		activeStatus: active,
	};
}

const stratumSessionCookie = 'stratum-session';

export function checkTimeleft (repeatAfter) {
	return dispatch => {
		const isActive = window.name && window.name === cookies.get(stratumSessionCookie);
		dispatch(setActiveStatus(isActive));
		if (!isActive) {
			// Not current session
			setTimeout(() => dispatch(checkTimeleft(repeatAfter)), repeatAfter);
			return;
		}
		return fetch(`${CLIENT_STRATUM_SERVER}/api/authentication/timeleft?_=${(new Date()).getTime()}`, {
			credentials: 'include',
		})
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					const timeleft = json.data;
					if (timeleft <= 0) {
						window.location.replace('\?loggedout');
					}
					else {
						dispatch(setTimeleft(timeleft));
					}
					// Less than 3 minutes left
					if (timeleft > 0 && typeof repeatAfter === 'number') {
						setTimeout(() => dispatch(checkTimeleft(repeatAfter)), repeatAfter);
					}
				}
			});
	};
}

export const SET_SHRINK_UNIT_NAME = 'SET_SHRINK_UNIT_NAME';

export function setShrinkUnitName (shrink) {
	return {
		type: SET_SHRINK_UNIT_NAME,
		shrink: shrink,
	};
}

export const UPDATE_SITHS_NEW_CARD = 'UPDATE_SITHS_NEW_CARD';

export function updateSithsNewCard (username, password) {
	return {
		type: UPDATE_SITHS_NEW_CARD,
		newCard: {
			valid: username.length > 0 && password.length > 0,
			username,
			password,
		},
	};
}
