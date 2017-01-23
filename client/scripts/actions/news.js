import fetch from '../utils/testable-fetch';
import { newError } from './error';
export const NEWS = 'NEWS';
export const CHANGE_YEAR_FILTER = 'CHANGE_YEAR_FILTER';
export const CHANGE_CURRENTPAGE = 'CHANGE_CURRENTPAGE';
export const NEWS_ARTICLE = 'NEWS_ARTICLE';
export const CLEAR_NEWS_ARTICLE = 'CLEAR_NEWS_ARTICLE';

export function changeYearFilter (filter) {
	return { type: CHANGE_YEAR_FILTER, filter };
};
const news = (newsArr) => {
	return { type: NEWS, news: newsArr };
};

export function getNews () {
	return (dispatch) => {
		return fetch('/api/news')
       .then(res => res.json())
       .then(json => dispatch(news(json.data.news)));
	};
}

export function changeCurrentPage (page) {
	return { type: CHANGE_CURRENTPAGE, page: page };
}

const newsArticle = (article) => {
	return { type: NEWS_ARTICLE, newsArticle: article };
};

export function getNewsArticle (nyhet, params) {
	let url = `/api/news/${nyhet}`;
	if (params) {
		const queryString = '?' + Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
		url += queryString;
	}
	return (dispatch) => {
		return	fetch(url)
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

export function clearNewsArticle () {
	return { type: CLEAR_NEWS_ARTICLE };
}
