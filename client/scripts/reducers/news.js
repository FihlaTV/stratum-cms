import { NEWS, CHANGE_YEAR_FILTER, CHANGE_CURRENTPAGE } from '../actions/news';

const filterNewsByYear = (newsArr, year) => newsArr.filter(obj => new Date(obj.publishedDate).getUTCFullYear() === year);

const createPagesArr = (articles) => Array.apply(null, { length: Math.ceil(articles.length / 5) }).map((item, index) => index + 1);
export default (state = 'loading', action) => {
	switch (action.type) {
		case NEWS:
			const newsArr = action.news;
			let newsObj = {};
			newsObj.articles = newsArr;
			newsObj.filterYears = newsArr.reduce((yearArr, obj) => {
				const year = new Date(obj.publishedDate).getUTCFullYear();
				if (yearArr.indexOf(year) === -1) {
					return yearArr.concat(year);
				} else {
					return yearArr;
				}
			}, []);
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
			if (action.filter === 'alla') {
				return Object.assign({}, state, { filteredNews: state.articles, pages: createPagesArr(state.articles) });
			} else if (typeof action.filter === 'number') {
				const filteredNews = filterNewsByYear(state.articles, action.filter);
				return Object.assign({}, state, { filteredNews: filteredNews, pages: createPagesArr(filteredNews) });
			}
			return state;
		case CHANGE_CURRENTPAGE:
			if (state.pages.indexOf(action.page) !== -1) {
				return Object.assign({}, state, { currentPage: action.page });
			}
			return state;
		default:
			return state;
	}
};
