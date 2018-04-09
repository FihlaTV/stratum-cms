import fetch from '../utils/testable-fetch';
import { newError } from './error';
export const RECEIVE_NEWS_ITEMS = 'RECEIVE_NEWS_ITEMS';
export const NEWS_ARTICLE = 'NEWS_ARTICLE';
export const CLEAR_NEWS_ARTICLE = 'CLEAR_NEWS_ARTICLE';

function getYearlyCount(newsItems) {
	return newsItems.reduce(
		(prev, { publishedDate, state }) => {
			const year =
				state !== 'draft'
					? new Date(publishedDate).getFullYear()
					: ' draft';

			prev[year] = prev[year] || 0;
			prev[year]++;
			prev.all++;

			return prev;
		},
		{ all: 0 }
	);
}

function receiveNewsItems(newsItems = []) {
	return {
		type: RECEIVE_NEWS_ITEMS,
		itemsPerYear: getYearlyCount(newsItems),
		items: newsItems,
		fetchedItems: true,
	};
}

export function fetchNewsItemsIfNeeded() {
	return (dispatch, getState) => {
		const { news } = getState();
		if (news.fetchedItems) {
			return;
		}
		return fetch('/api/news', { credentials: 'include' })
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(receiveNewsItems(json.data.news));
				} else {
					throw new Error(json.error);
				}
			})
			.catch(error => {
				dispatch(newError(error.message));
			});
	};
}

function newsArticle(article) {
	return {
		type: NEWS_ARTICLE,
		newsArticle: article,
	};
}

export function getNewsArticle(nyhet, params) {
	let url = `/api/news/${nyhet}`;
	if (params) {
		const queryString =
			'?' +
			Object.keys(params)
				.map(key => `${key}=${params[key]}`)
				.join('&');
		url += queryString;
	}
	return dispatch => {
		return fetch(url, { credentials: 'include' })
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(newsArticle(json.data));
				} else {
					throw new Error(json.error);
				}
			})
			.catch(error => {
				dispatch(newError(error.message));
			});
	};
}

export function clearNewsArticle() {
	return { type: CLEAR_NEWS_ARTICLE };
}
