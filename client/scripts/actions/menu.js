import fetch from '../utils/testable-fetch';

export const RECEIVE_MENU_ITEMS = 'RECEIVE_MENU_ITEMS';

function receiveMenuItems(items) {
	return {
		type: RECEIVE_MENU_ITEMS,
		items,
	};
}

export function fetchMenuItems() {
	return dispatch => {
		return fetch('/api/menu', { credentials: 'include' })
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(receiveMenuItems(json.data));
				} else {
					throw new Error(json.error);
				}
			})
			.catch(error => {
				console.log('Failed to load menu items', error);
			});
	};
}
