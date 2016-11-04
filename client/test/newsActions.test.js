import expect from 'expect';
import * as actions from '../scripts/actions/news.js';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
const { LOCAL_MOCK_URL } = process.env;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Page actions', () => {
	afterEach(() => {
		nock.cleanAll();
	});

	it('incrementCurrentPage sends a action with type INCREMENT_CURRENTPAGE', () => {
		const expectedAction = {
			type: 'INCREMENT_CURRENTPAGE',
		};
		expect(actions.incrementCurrentPage()).toEqual(expectedAction, 'hej');
	});

	it('decrementCurrentPage sends an action with type DECREMENT_CURRENTPAGE', () => {
		const expectedAction = {
			type: 'DECREMENT_CURRENTPAGE',
		};
		expect(actions.decrementCurrentPage()).toEqual(expectedAction);
	});

	it('changeCurrentPage sends an action with type CHANGE_CURRENTPAGE and page as a number', () => {
		const expectedAction = {
			type: 'CHANGE_CURRENTPAGE',
			page: 14,
		};
		expect(actions.changeCurrentPage(14)).toEqual(expectedAction);
	});

	it('changeYearFilter sends an action with type CHANGE_YEAR_FILTER and a filter year', () => {
		const expectedAction = {
			type: 'CHANGE_YEAR_FILTER',
			filter: 2015,
		};
		expect(actions.changeYearFilter(2015)).toEqual(expectedAction);
	});
});

describe('getNews Action', () => {

	it('getNews will fetch list of newsItems, then post an action with type NEWS and news with a array of newsItems', () => {
		const mockNewsArr = [
			{ "_id":"581719cfe87f6bd027229e28","slug":"bacon-ipsum4","title":"Bacon ipsum4","publishedDate":"2015-10-25T22:00:00.000Z","content":{"lead":"Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!4"}},
			{"_id":"581719cfe87f6bd027229e2d","slug":"bacon-ipsum9","title":"Bacon ipsum9","publishedDate":"2011-10-25T22:00:00.000Z","content":{"lead":"Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!9"}},
			{"_id":"581719cfe87f6bd027229e32","slug":"bacon-ipsum14","title":"Bacon ipsum14","publishedDate":"2010-10-25T22:00:00.000Z","content":{"lead":"Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!14"}}
		];
		nock(LOCAL_MOCK_URL)
			.get('/api/news')
			.reply(0, {
				success: true,
				data: { news: mockNewsArr },
			});

		const expectedAction = [{
			type: 'NEWS',
			news: mockNewsArr,
		}];

		const store = mockStore({ news: { articles: [] } });
		return store.dispatch(actions.getNews())
			.then(() => {
				expect(store.getActions()).toEqual(expectedAction);
			});
	});
});
