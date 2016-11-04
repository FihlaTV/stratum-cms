import { NEWS, CHANGE_YEAR_FILTER, INCREMENT_CURRENTPAGE, DECREMENT_CURRENTPAGE, CHANGE_CURRENTPAGE } from '../actions/news';

const filterNewsByYear = (newsArr, year) => newsArr.filter(obj => new Date(obj.publishedDate).getUTCFullYear() === year);

const createPagesArr = (articles) => Array.apply(null, { length: Math.ceil(articles.length / 5) }).map((item, index) => index + 1);
export default (state = 'loading', action) => {
	switch (action.type) {
		case NEWS:
			const newsArr = action.news.reverse();
			let newsObj = {};
			newsObj.articles = newsArr;
			newsObj.filterYears = Array.from(new Set(newsArr.map(obj => new Date(obj.publishedDate).getUTCFullYear())));
			newsObj.articlesPerYear = newsObj.filterYears.reduce((pre, curr) => {
				pre[curr] = filterNewsByYear(newsArr, curr).length;
				return pre;
			}, { all: newsArr.length });
			newsObj.numberOfArticles = newsArr.length;
			newsObj.filteredNews = newsArr;
			newsObj.pages = createPagesArr(newsObj.articles);
			newsObj.currentPage = 1;
			return Object.assign({}, newsObj);
		case CHANGE_YEAR_FILTER:
			if (action.filter === 'Alla') {
				return Object.assign({}, state, { filteredNews: state.articles, pages: createPagesArr(state.articles), currentPage: 1 });
			} else if (typeof action.filter === 'number') {
				const filteredNews = filterNewsByYear(state.articles, action.filter);
				return Object.assign({}, state, { filteredNews: filteredNews, pages: createPagesArr(filteredNews), currentPage: 1 });
			}
			return state;
		case INCREMENT_CURRENTPAGE:
			if (state.currentPage <= state.pages.length - 1) {
				return Object.assign({}, state, { currentPage: state.currentPage + 1 });
			} else {
				return Object.assign({}, state, { currentPage: state.pages.length });
			}
		case DECREMENT_CURRENTPAGE:
			if (state.currentPage > 1) {
				return Object.assign({}, state, { currentPage: state.currentPage - 1 });
			} else {
				return Object.assign({}, state, { currentPage: 1 });
			}
		case CHANGE_CURRENTPAGE:
			if (state.pages.indexOf(action.page) !== -1) {
				return Object.assign({}, state, { currentPage: action.page });
			}
			return state;
		default:
			return state;
	}
};
