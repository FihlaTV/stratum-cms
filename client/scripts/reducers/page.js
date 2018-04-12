const initialState = {};

import { RECEIVE_PAGE, SET_LOADING, CLEAR_PAGE } from '../actions/page';

export default (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_PAGE:
			return Object.assign({}, state, { currentPage: action.page });
		case SET_LOADING:
			return Object.assign({}, state, { isLoading: action.isLoading });
		case CLEAR_PAGE:
			return Object.assign({}, state, { currentPage: undefined });
		default:
			return state;
	}
};
