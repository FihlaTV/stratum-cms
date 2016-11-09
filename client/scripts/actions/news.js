import fetch from '../utils/testable-fetch';
export const NEWS = 'NEWS';
export const CHANGE_YEAR_FILTER = 'CHANGE_YEAR_FILTER';
export const CHANGE_CURRENTPAGE = 'CHANGE_CURRENTPAGE';

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
