const initialState = { };

import { RECEIVE_WIDGET } from '../actions/widget';

export default (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_WIDGET:
			return Object.assign({}, state, {
				widget: action.widget,
			});
		default:
			return state;
	}
};
