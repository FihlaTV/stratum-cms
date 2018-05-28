import fetch from '../utils/testable-fetch';
export const FETCH_SEARCH_RESULTS = 'FETCH_SEARCH_RESULTS';
export const BEGIN_FETCH_SEARCH_RESULTS = 'BEGIN_FETCH_SEARCH_RESULTS';
export const CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS';
export const CHANGE_SEARCH_QUERY = 'CHANGE_SEARCH_QUERY';
const { CLIENT_GOOGLE_API_KEY, CLIENT_GOOGLE_SEARCH_CX } = process.env;

export function searchResults({ queries, items, searchInformation }) {
	return { type: FETCH_SEARCH_RESULTS, queries, items, searchInformation };
}

export function changeQuery(query) {
	return { type: CHANGE_SEARCH_QUERY, query };
}

export function fetchSearchResults(query, page) {
	const start = page ? (parseInt(page, 10) - 1) * 10 : 1;
	const url = `https://www.googleapis.com/customsearch/v1?key=${CLIENT_GOOGLE_API_KEY}&cx=${CLIENT_GOOGLE_SEARCH_CX}&q=${encodeURI(
		query
	)}&start=${start}`;
	return dispatch => {
		dispatch({
			type: BEGIN_FETCH_SEARCH_RESULTS,
		});
		return fetch(url)
			.then(res => res.json())
			.then(json => dispatch(searchResults(json)));
	};
}

export function clearSearchResults() {
	return { type: CLEAR_SEARCH_RESULTS };
}
