import fetch from '../utils/testable-fetch';
export const FETCHED_CONTACTS = 'FETCHED_CONTACTS';
export const CLEAR_CONTACTS = 'CLEAR_CONTACTS';

export function fetchContactsIfNeeded() {
	var url = '/api/contacts';
	return (dispatch, getState) => {
		if (getState().contacts.fetchSuccessful) {
			return;
		}
		return fetch(url)
			.then(res => res.json())
			.then(json =>
				dispatch({
					type: FETCHED_CONTACTS,
					contacts: json.data,
					fetchSuccessful: json.success,
				})
			);
	};
}

export function clearContacts() {
	return { type: CLEAR_CONTACTS };
}
