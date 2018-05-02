import { FETCHED_CONTACTS, CLEAR_CONTACTS } from '../actions/contacts';
const initialState = { loading: true, contacts: [] };

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCHED_CONTACTS:
			return Object.assign({}, state, {
				loading: false,
				contacts: action.contacts,
				fetchSuccessful: action.fetchSuccessful,
			});
		case CLEAR_CONTACTS:
			return Object.assign({}, state, {
				loading: true,
				contacts: [],
				fetchSuccessful: null,
			});
		default:
			return state;
	}
};
