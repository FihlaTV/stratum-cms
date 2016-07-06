import fetch from 'isomorphic-fetch';
import cookies from 'js-cookie';

const COOKIE_NAME = 'stratum-cms.hidden-messages';
const COOKIE_CONSENT = 'stratum-cms.cc';
// export const SHOW_CONTEXT_MODAL = 'SHOW_CONTEXT_MODAL';

// export function showContextModal(show) {
// 	return {
// 		type: SHOW_CONTEXT_MODAL,
// 		show: show
// 	};
// }

function addToCookie(id){
	const arr = cookies.getJSON(COOKIE_NAME) || [];
	if(arr.indexOf(id) === -1){
		cookies.set(COOKIE_NAME, [...arr, id], { expires: 1 });
	}
}

function getHiddenIds(){
	return cookies.getJSON(COOKIE_NAME) || [];
}

export const MESSAGE_ERROR = 'MESSAGE_ERROR';

function messageError(error) {
	return {
		type: MESSAGE_ERROR,
		error: error
	};
}

export const RECEIVE_MESSAGES = 'RECEIVE_MESSAGES';

function receiveMessages(messages){
	return {
		type: RECEIVE_MESSAGES,
		messages: messages
	};
}

export const SHOW_MESSAGE = 'SHOW_MESSAGE';

export function showMessage(id, show){
	addToCookie(id);
	return {
		type: SHOW_MESSAGE,
		id: id,
		show: show
	};
}

export const COOKIE_ACCEPTED = 'COOKIE_ACCEPTED';

export function acceptCookie(){
	cookies.set(COOKIE_CONSENT, 1);
	return cookieAccepted(true);
}

function cookieAccepted(accepted){
	return {
		type: COOKIE_ACCEPTED,
		accepted: accepted
	};
}

export function initMessages(){
	return (dispatch) => {
		dispatch(cookieAccepted(cookies.get(COOKIE_CONSENT) === '1'));
		dispatch(fetchMessages());
	};
}

export function fetchMessages(){
	return (dispatch) => {
		// dispatch(setContextLoadFlag(true));
		fetch(`/api/messages?_=${(new Date()).getTime()}`, { 
				credentials: 'include' 
			})
			.then(res => res.json())
			.then(json => {
				if(json.success){
					// const messages = json.data.messages;
					dispatch(receiveMessages(json.data.messages.map(m => {m.visible = getHiddenIds().indexOf(m._id) === -1; return m;})));
				} else {
					const error = new Error(json.message);
					throw (error);
				}
			})
			.catch(error => { 
				// dispatch(setContextLoadFlag(false));
				console.log('request failed', error); 
				dispatch(contextError(error));
			});
	};
}
