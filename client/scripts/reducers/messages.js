const initialState = { items: [], cookiesAccepted: true };

import { MESSAGE_ERROR, RECEIVE_MESSAGES, SHOW_MESSAGE, COOKIE_ACCEPTED, REMOVE_MESSAGE } from '../actions/messages';

const message = (state, action) => {
	switch (action.type) {
		case SHOW_MESSAGE:
			if (state._id !== action.id) {
				return state;
			}
			return Object.assign({}, state, {
				visible: action.show,
			});
		default:
			return state;
	}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_MESSAGES:
			return Object.assign({}, state, {
				// Don't add duplicates to items
				items: state.items.concat(
					action.messages.filter(msg => {
						return !state.items.find(newMsg => newMsg._id === msg._id);
					})
				),
			});
		case MESSAGE_ERROR:
			return Object.assign({}, state, {
				error: action.error,
			});
		case SHOW_MESSAGE:
			return Object.assign({}, state, {
				items: state.items.map((m) => message(m, action)),
			});
		case COOKIE_ACCEPTED:
			return Object.assign({}, state, {
				cookiesAccepted: action.accepted,
			});
		case REMOVE_MESSAGE:
			return Object.assign({}, state, {
				items: state.items.filter((i) => i._id !== action.message),
			});
		default:
			return state;
	}
};
