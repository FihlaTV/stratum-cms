import { NEWS, NEWS_ARTICLE, CLEAR_NEWS_ARTICLE } from '../actions/news';

const initialState = {
	loading: true,
	newsArticle: { loading: true },
	title: 'Nyheter och meddelanden',
	itemsPerYear: { all: 0 },
};

export default (state = initialState, action) => {
	switch (action.type) {
		case NEWS:
			return Object.assign({}, state, {
				items: action.items,
				itemsPerYear: action.itemsPerYear,
				loading: false,
			});
		case NEWS_ARTICLE:
			const article = Object.assign({}, action.newsArticle, { loading: false });
			return Object.assign({}, state, { newsArticle: article });
		case CLEAR_NEWS_ARTICLE:
			return Object.assign({}, state, { newsArticle: initialState.newsArticle });
		default:
			return state;
	}
};
