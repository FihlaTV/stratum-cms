const initialState = { };

import { RECEIVE_START_PAGE } from '../actions/startPage';

export default (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_START_PAGE:
			const {
				description,
				header,
				informationBlurb,
				jumbotron,
				widgets,
			} = action;
			return Object.assign({}, state, { description, header, informationBlurb, jumbotron, widgets });
		default:
			return state;
	}
};
