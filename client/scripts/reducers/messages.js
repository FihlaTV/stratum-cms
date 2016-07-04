const initialState = {};

import { MESSAGE_ERROR, SET_MESSAGES } from '../actions/messages';

export default (state = initialState, action) => {
	switch (action.type){
		case SET_MESSAGES: 
			return Object.assign({}, initialState, {
				messages: action.messages
			});
		case MESSAGE_ERROR:
			return Object.assign({}, initialState, {
				error: action.error
			});
		default: 
			return state;
	}
};
