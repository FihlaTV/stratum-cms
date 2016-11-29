export const SET_BREADCRUMBS = 'SET_BREADCRUMBS';
export const CLEAR_BREADCRUMBS = 'CLEAR_BREADCRUMBS';

const indexRoute = { url: '/react/', label: 'Start' };

export function setBreadcrumbs (breadcrumbs = [], addIndexRoute = true) {
	let bcs = breadcrumbs;
	if (addIndexRoute) {
		bcs = breadcrumbs.map((bc) => Object.assign({}, bc, { url: `${indexRoute.url}${bc.url}` }));
		bcs.unshift(indexRoute);
	}
	return {
		type: SET_BREADCRUMBS,
		breadcrumbs: bcs,
	};
}

export function clearBreadcrumbs () {
	return {
		type: CLEAR_BREADCRUMBS,
	};
}
