import fetch from '../utils/testable-fetch';

export const RECEIVE_PAGE = 'RECEIVE_PAGE';
export const SET_LOADING = 'SET_LOADING';

function receivePage (page) {
	return {
		type: RECEIVE_PAGE,
		page,
	};
}

function setLoading (isLoading) {
	return {
		type: SET_LOADING,
		isLoading,
	};
}

export function fetchPage (pageId) {
	return (dispatch) => {
		dispatch(setLoading(true));
		return fetch(`/api/pages/${pageId}`, { credentials: 'include' })
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(receivePage(json.data));
					dispatch(setLoading(false));
				} else {
					throw new Error(json.error);
				}
			})
			.catch(error => {
				console.log('Failed to load menu items', error);
				dispatch(setLoading(false));
			});
	};
}
