const { CLIENT_GOOGLE_API_KEY, CLIENT_GOOGLE_SEARCH_CX } = process.env;
const initialState = {
	items: [],
	enableSearch: !!(CLIENT_GOOGLE_API_KEY && CLIENT_GOOGLE_SEARCH_CX),
};

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
