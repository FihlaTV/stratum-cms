import {
	CLEAR_SEARCH_RESULTS,
	FETCH_SEARCH_RESULTS,
	CHANGE_SEARCH_QUERY,
	BEGIN_FETCH_SEARCH_RESULTS,
} from '../actions/search';
const initialState = { query: '', loading: false, items: [] };

export default (state = initialState, action) => {
	switch (action.type) {
		case BEGIN_FETCH_SEARCH_RESULTS:
			return Object.assign({}, state, {
				loading: true,
				items: [],
				query: action.query,
				error: null,
			});
		case FETCH_SEARCH_RESULTS:
			return Object.assign({}, state, {
				loading: false,
				items: action.items,
				queries: action.queries,
				searchInformation: action.searchInformation,
				error: action.error,
			});
		case CLEAR_SEARCH_RESULTS:
			return initialState;
		case CHANGE_SEARCH_QUERY:
			return Object.assign({}, state, {
				query: action.query,
			});
		default:
			return state;
	}
};
