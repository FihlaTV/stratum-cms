export const SET_BREADCRUMBS = 'SET_BREADCRUMBS';
export const CLEAR_BREADCRUMBS = 'CLEAR_BREADCRUMBS';

const { CLIENT_TITLE = '', CLIENT_TITLE_SEPARATOR = '·' } = process.env;
const indexRoute = { url: '/', label: 'Start' };

/**
 * Sets the breadcrumbs which should be visible in the page head with help from label and url
 *
 * @param breadcrumbs {array} array consisting of objects of shap { url: 'link-to-title', label: 'Title' }
 * @param addIndexRoute {boolean} adds a index route at the start of the breadcrumbs linking to the index page.
 */
export function setBreadcrumbs(breadcrumbs = [], addIndexRoute = true, title) {
	let bcs = breadcrumbs;
	if (addIndexRoute) {
		bcs = breadcrumbs.map(bc =>
			Object.assign({}, bc, { url: `${indexRoute.url}${bc.url}` })
		);
		bcs.unshift(indexRoute);
	}
	if (title) {
		setTitle(title);
	}
	return {
		type: SET_BREADCRUMBS,
		breadcrumbs: bcs,
	};
}

export function setTitle(title) {
	if (!title) {
		document.title = CLIENT_TITLE;
	} else if (!CLIENT_TITLE) {
		document.title = title;
	} else if (title && CLIENT_TITLE) {
		document.title = `${title} ${CLIENT_TITLE_SEPARATOR} ${CLIENT_TITLE}`;
	}
}

/**
 * Clears all breadcrumbs from the current state.
 */
export function clearBreadcrumbs(clearTitle = true) {
	if (clearTitle) {
		setTitle('');
	}
	return {
		type: CLEAR_BREADCRUMBS,
	};
}
