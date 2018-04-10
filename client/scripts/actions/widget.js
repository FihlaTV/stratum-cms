import fetch from '../utils/testable-fetch';

export const RECEIVE_WIDGET = 'RECEIVE_WIDGET';

function receiveWidget(widget) {
	return {
		type: RECEIVE_WIDGET,
		widget,
	};
}

export function fetchWidget(id) {
	return dispatch => {
		return fetch(`/api/widgets/${id}`)
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(receiveWidget(json.data));
				} else {
					throw new Error(json.error);
				}
			})
			.catch(error => {
				console.log('Failed to load menu items', error);
			});
	};
}
