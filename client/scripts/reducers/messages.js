const initialState = { items: [] };

import { MESSAGE_ERROR, RECEIVE_MESSAGES, SHOW_MESSAGE } from '../actions/messages';

const message = (state, action) => {
	switch (action.type) {
		case SHOW_MESSAGE:
			if (state._id !== action.id) {
				return state;
			}
			return Object.assign({}, state, {
				visible: action.show
			});
		default:
			return state;
	}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_MESSAGES:
			return Object.assign({}, state, {
				items: action.messages
			});
		case MESSAGE_ERROR:
			return Object.assign({}, state, {
				error: action.error
			});
		case SHOW_MESSAGE:
			return Object.assign({}, state, {
				items: state.items.map((m) => message(m, action))
			});
		default:
			return state;
	}
};
