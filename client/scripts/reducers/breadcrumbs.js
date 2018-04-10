const initialState = {
	items: [],
};

import { SET_BREADCRUMBS, CLEAR_BREADCRUMBS } from '../actions/breadcrumbs';

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_BREADCRUMBS:
			return Object.assign({}, state, {
				items: action.breadcrumbs,
			});
		case CLEAR_BREADCRUMBS:
			return Object.assign({}, state, {
				items: initialState.items,
			});
		default:
			return state;
	}
};
