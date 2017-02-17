const initialState = { items: [] };

import { RECEIVE_MENU_ITEMS } from '../actions/menu';

export default (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_MENU_ITEMS:
			return Object.assign({}, state, {
				items: action.items,
			});
		default:
			return state;
	}
};
