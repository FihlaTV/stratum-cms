const initialState = { };

import { RECEIVE_PAGE, SET_LOADING } from '../actions/page';

export default (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_PAGE:
			return action.page;
		case SET_LOADING:
			return Object.assign({}, state, { isLoading: action.isLoading });
		default:
			return state;
	}
};
