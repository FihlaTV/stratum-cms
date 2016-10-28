import fetch from 'isomorphic-fetch';
export const NEWS = 'NEWS';
export const CHANGE_YEAR_FILTER = 'CHANGE_YEAR_FILTER';
export const INCREMENT_CURRENTPAGE = 'INCREMENT_CURRENTPAGE';
export const DECREMENT_CURRENTPAGE = 'DECREMENT_CURRENTPAGE';
export const CHANGE_CURRENTPAGE = 'CHANGE_CURRENTPAGE';

export function changeYearFilter (filter) {
	return { type: CHANGE_YEAR_FILTER, filter };
};
const messages = (newsArr) => {
	return { type: NEWS, news: newsArr };
};

export function getNews () {
	return (dispatch) => {
		fetch('/api/news')
       .then(res => res.json())
       .then(json => dispatch(messages(json.data.messages)));
	};
}

export function incrementCurrentPage () {
	return { type: INCREMENT_CURRENTPAGE };
}

export function decrementCurrentPage () {
	return { type: DECREMENT_CURRENTPAGE };
}

export function changeCurrentPage (page) {
	return { type: CHANGE_CURRENTPAGE, page: page };
}
