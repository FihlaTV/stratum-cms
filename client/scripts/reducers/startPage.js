const initialState = { };

import { RECEIVE_START_PAGE } from '../actions/startPage';

export default (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_START_PAGE:
			const {
				description,
				header,
				internalLinks,
				informationBlurb,
				jumbotron,
				widgets,
				isPortal,
				subRegisters,
				quickLink,
			} = action;
			return Object.assign({}, state, { description, header, internalLinks, informationBlurb, jumbotron, widgets, isPortal, subRegisters, quickLink });
		default:
			return state;
	}
};
