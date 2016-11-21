import fetch from '../utils/testable-fetch';

export const RECEIVE_REGISTER_INFORMATION = 'RECEIVE_REGISTER_INFORMATION';

function receiveRegisterInformation (registerInformation) {
	return {
		type: RECEIVE_REGISTER_INFORMATION,
		registerInformation,
	};
}

export function fetchRegisterInformation (pageId) {
	return (dispatch) => {
		return fetch(`/api/register-information`)
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(receiveRegisterInformation(json.data));
				} else {
					throw new Error(json.error);
				}
			})
			.catch(error => {
				console.log('Failed to load menu items', error);
			});
	};
}
