import * as actions from '../scripts/actions/news';
import newsReducer from '../scripts/reducers/news';
import expect from 'expect';
import 'babel-polyfill';

describe('News reducer test for case NEWS', () => {
	it('When no news exists it returns the string "loading"', () => {
		expect(newsReducer(undefined, {})).toEqual('loading');
	});

	it('When initilized by an action with the type NEWS, it creates state object', () => {
/*eslint-disable*/
		const mockNewsArr = [
			{ "_id":"581719cfe87f6bd027229e28","slug":"bacon-ipsum4","title":"Bacon ipsum4","publishedDate":"2015-10-25T22:00:00.000Z","content":{"lead":"Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!4"}},
			{"_id":"581719cfe87f6bd027229e2d","slug":"bacon-ipsum9","title":"Bacon ipsum9","publishedDate":"2011-10-25T22:00:00.000Z","content":{"lead":"Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!9"}},
			{"_id":"581719cfe87f6bd027229e32","slug":"bacon-ipsum14","title":"Bacon ipsum14","publishedDate":"2010-10-25T22:00:00.000Z","content":{"lead":"Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!14"}}
		];
/*eslint-enable*/
		const reducer = newsReducer(undefined, { type: actions.NEWS, news: mockNewsArr });
		expect(reducer).toBeA('object');
		expect(reducer.articles).toEqual(mockNewsArr);
		expect(reducer.filterYears).toEqual([2010, 2011, 2015]);
		expect(reducer.articlesPerYear).toEqual({ all: 3, 2010: 1, 2011: 1, 2015: 1 });
		expect(reducer.numberOfArticles).toEqual(3);
		expect(reducer.filteredNews).toEqual(mockNewsArr.reverse());
		expect(reducer.pages).toEqual([1]);
		expect(reducer.currentPage).toEqual(1);
	});
});

describe('News reducer tests for INCREMENT_CURRENTPAGE case', () => {
	it('When there are pages with higher number', () => {
		expect(newsReducer({ currentPage: 1, pages: [1, 2, 3, 4] }, { type: actions.INCREMENT_CURRENTPAGE })).toEqual({ currentPage: 2, pages: [1, 2, 3, 4] });
		expect(newsReducer({ currentPage: 2, pages: [1, 2, 3, 4] }, { type: actions.INCREMENT_CURRENTPAGE })).toEqual({ currentPage: 3, pages: [1, 2, 3, 4] });
	});

	it('When calling INCREMENT_CURRENTPAGE on the last page it will return the last page', () => {
		expect(newsReducer({ currentPage: 4, pages: [1, 2, 3, 4] }, { type: actions.INCREMENT_CURRENTPAGE })).toEqual({ currentPage: 4, pages: [1, 2, 3, 4] });
	});
});

describe('News reducer tests for DECREMENT_CURRENTPAGE case', () => {
	it('When the pages is over 1 it will decrement', () => {
		expect(newsReducer({ currentPage: 4, pages: [1, 2, 3, 4] }, { type: actions.DECREMENT_CURRENTPAGE })).toEqual({ currentPage: 3, pages: [1, 2, 3, 4] });
		expect(newsReducer({ currentPage: 3, pages: [1, 2, 3, 4] }, { type: actions.DECREMENT_CURRENTPAGE })).toEqual({ currentPage: 2, pages: [1, 2, 3, 4] });
	});

	it('When the page is one or lower it will be set too 1', () => {
		expect(newsReducer({ currentPage: 1, pages: [1, 2, 3, 4] }, { type: actions.DECREMENT_CURRENTPAGE })).toEqual({ currentPage: 1, pages: [1, 2, 3, 4] });
		expect(newsReducer({ currentPage: -2, pages: [1, 2, 3, 4] }, { type: actions.DECREMENT_CURRENTPAGE })).toEqual({ currentPage: 1, pages: [1, 2, 3, 4] });
	});
});

describe('News reducer test for CHANGE_CURRENTPAGE case', () => {
	it('When the page exist in the pages array it will go too that page', () => {
		expect(newsReducer({ currentPage: 1, pages: [1, 2, 3, 4] }, { type: actions.CHANGE_CURRENTPAGE, page: 3 })).toEqual({ currentPage: 3, pages: [1, 2, 3, 4] });
		expect(newsReducer({ currentPage: 1, pages: [1, 2, 3, 4] }, { type: actions.CHANGE_CURRENTPAGE, page: 2 })).toEqual({ currentPage: 2, pages: [1, 2, 3, 4] });
	});

	it('If the page dosen`t exist it will stay on the currentPage', () => {
		expect(newsReducer({ currentPage: 3, pages: [1, 2, 3, 4] }, { type: actions.CHANGE_CURRENTPAGE, page: 12 })).toEqual({ currentPage: 3, pages: [1, 2, 3, 4] });
		expect(newsReducer({ currentPage: 3, pages: [1, 2, 3, 4] }, { type: actions.CHANGE_CURRENTPAGE, page: -1 })).toEqual({ currentPage: 3, pages: [1, 2, 3, 4] });
	});
});
