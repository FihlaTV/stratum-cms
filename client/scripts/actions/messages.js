import fetch from 'isomorphic-fetch';
import cookies from 'js-cookie';

const COOKIE_NAME = 'stratum-cms.hidden-messages';
const COOKIE_CONSENT = 'stratum-cms.cc';
const { CLIENT_MASTER_MESSAGE_URL } = process.env;

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
		dispatch(fetchMessages('/api/messages'));
		if(CLIENT_MASTER_MESSAGE_URL){
			dispatch(fetchMessages(CLIENT_MASTER_MESSAGE_URL));
		}
	};
}

export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';

function removeMessage(id){
	return {
		type: REMOVE_MESSAGE,
		message: id
	};
}

export function fetchMessages(uri){
	return (dispatch) => {
		fetch(`${uri}?_=${(new Date()).getTime()}`)
			.then(res => res.json())
			.then(json => {
				if(json.success){
					dispatch(receiveMessages(json.data.messages.map(m => {
						// Time in miliseconds til endTime
						const msToEnd = (new Date(m.endTime)).getTime() - (new Date()).getTime(); 
						m.visible = getHiddenIds().indexOf(m._id) === -1; 
						// Automatically remove the ones within 4 hours when time runs out
						if(msToEnd < 4 * 60 * 60 * 1000){
							setTimeout(() => dispatch(removeMessage(m._id)), msToEnd);

						}
						return m;
					})));
				} else {
					const error = new Error(json.message);
					throw (error);
				}
			})
			.catch(error => { 
				console.log('Failed to load messages', error); 
				dispatch(messageError(error));
			});
	};
}
