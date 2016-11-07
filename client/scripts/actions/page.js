import fetch from '../utils/testable-fetch';

export const RECEIVE_PAGE = 'RECEIVE_PAGE';

function receivePage (page) {
	return {
		type: RECEIVE_PAGE,
		page,
	};
}

export function initPage (pageId) {
	return (dispatch) => {
		return fetch(`/api/pages/${pageId}`, { credentials: 'include' })
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(receivePage(json.data));
				} else {
					throw new Error(json.error);
				}
			})
			.catch(error => {
				console.log('Failed to load menu items', error);
			});
	};
}
