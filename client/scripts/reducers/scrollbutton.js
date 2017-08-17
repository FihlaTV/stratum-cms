import { SHOW_SCROLL_BUTTON } from '../actions/scrollbutton';
const initialState = {
	show: true,
 };

export default (state = initialState, action) => {
	switch (action.type) {
		case SHOW_SCROLL_BUTTON:
			return Object.assign({}, state, { show: action.show });
		default:
			return state;
	}
};
