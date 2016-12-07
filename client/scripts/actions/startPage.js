import fetch from '../utils/testable-fetch';

export const RECEIVE_START_PAGE = 'RECEIVE_START_PAGE';
// export const SET_LOADING = 'SET_LOADING';

function receiveStartPage (startPage) {
	return {
		type: RECEIVE_START_PAGE,
		...startPage,
	};
}

// function setLoading (isLoading) {
// 	return {
// 		type: SET_LOADING,
// 		isLoading,
// 	};
// }

export function fetchStartPage () {
	return (dispatch) => {
		// dispatch(setLoading(true));
		return fetch(`/api/start-page`)
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(receiveStartPage(json.data));
					// dispatch(setLoading(false));
				} else {
					throw new Error(json.error);
				}
			})
			.catch(error => {
				console.log('Failed to load start page', error);
				// dispatch(setLoading(false));
			});
	};
}
