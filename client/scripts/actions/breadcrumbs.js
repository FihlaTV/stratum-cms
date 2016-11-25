export const SET_BREADCRUMBS = 'SET_BREADCRUMBS';
export const CLEAR_BREADCRUMBS = 'CLEAR_BREADCRUMBS';

export function setBreadcrumbs (breadcrumbs) {
	return {
		type: SET_BREADCRUMBS,
		breadcrumbs,
	};
}

export function clearBreadcrumbs () {
	return {
		type: CLEAR_BREADCRUMBS,
	};
}
