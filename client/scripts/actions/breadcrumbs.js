export const SET_BREADCRUMBS = 'SET_BREADCRUMBS';
export const CLEAR_BREADCRUMBS = 'CLEAR_BREADCRUMBS';

const indexRoute = { url: '/react/', label: 'Start' };

/**
 * Sets the breadcrumbs which should be visible in the page head with help from label and url
 *
 * @param breadcrumbs {array} array consisting of objects of shap { url: 'link-to-title', label: 'Title' }
 * @param addIndexRoute {boolean} adds a index route at the start of the breadcrumbs linking to the index page.
 */
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

/**
 * Clears all breadcrumbs from the current state.
 */
export function clearBreadcrumbs () {
	return {
		type: CLEAR_BREADCRUMBS,
	};
}
