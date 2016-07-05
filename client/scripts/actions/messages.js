import fetch from 'isomorphic-fetch';

// export const SHOW_CONTEXT_MODAL = 'SHOW_CONTEXT_MODAL';

// export function showContextModal(show) {
// 	return {
// 		type: SHOW_CONTEXT_MODAL,
// 		show: show
// 	};
// }

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
	return {
		type: SHOW_MESSAGE,
		id: id,
		show: show
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
					dispatch(receiveMessages(json.data.messages.map(m => {m.visible = true; return m;})));
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
