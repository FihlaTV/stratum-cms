const initialState = {
	location: {},
};

import { RECEIVE_REGISTER_INFORMATION } from '../actions/registerInformation';

export default (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_REGISTER_INFORMATION:
			return action.registerInformation;
		default:
			return state;
	}
};
