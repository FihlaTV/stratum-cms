import { NEW_ERROR, CLEAR_ERROR } from '../actions/error';
const initialState = { status: false, message: '' };

export default (state = initialState, action) => {
	switch (action.type) {
		case NEW_ERROR:
			return Object.assign({}, state, { status: true, message: action.message });
		case CLEAR_ERROR:
			return Object.assign({}, state, { status: false, message: '' });
		default:
			return state;
	}
};
