import fetch from 'isomorphic-fetch';

export const RECEIVE_MENU_ITEMS = 'RECEIVE_MENU_ITEMS';

function receiveMenuItems (items) {
	return {
		type: RECEIVE_MENU_ITEMS,
		items,
	};
}

export function fetchMenuItems () {
	return (dispatch) => {
		fetch('/api/menu')
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(receiveMenuItems(json.data));
				}
				throw new Error(json.error);
			})
			.catch(error => {
				console.log('Failed to load menu items', error);
			});
	};
}
