const initialState = { };

import { RECEIVE_PAGE } from '../actions/page';

export default (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_PAGE:
			return Object.assign({}, state, action.page);
		default:
			return state;
	}
};
