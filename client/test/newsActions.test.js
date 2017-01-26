import expect from 'expect';
import * as actions from '../scripts/actions/news.js';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
const { LOCAL_MOCK_URL } = process.env;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('fetchNewsItemsIfNeeded action', () => {

	it('fetchNewsItemsIfNeeded will fetch list of newsItems, then post an action with type NEWS and news with a array of newsItems', () => {
		const mockNewsArr = [
			{ _id: '581719cfe87f6bd027229e28', slug: 'bacon-ipsum4', title: 'Bacon ipsum4', publishedDate: '2015-10-25T22:00:00.000Z', content: { lead: 'Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!4' } },
			{ _id: '581719cfe87f6bd027229e2d', slug: 'bacon-ipsum9', title: 'Bacon ipsum9', publishedDate: '2011-10-25T22:00:00.000Z', content: { lead: 'Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!9' } },
			{ _id: '581719cfe87f6bd027229e32', slug: 'bacon-ipsum14', title: 'Bacon ipsum14', publishedDate: '2010-10-25T22:00:00.000Z', content: { lead: 'Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!14' } },
		];
		nock(LOCAL_MOCK_URL)
			.get('/api/news')
			.reply(0, {
				success: true,
				data: { news: mockNewsArr },
			});

		const expectedAction = [{
			type: actions.RECEIVE_NEWS_ITEMS,
			items: mockNewsArr,
			itemsPerYear: {
				2010: 1,
				2011: 1,
				2015: 1,
				all: mockNewsArr.length,
			},
			fetchedItems: true,
		}];

		const store = mockStore({ news: { articles: [] } });
		return store.dispatch(actions.fetchNewsItemsIfNeeded())
			.then(() => {
				expect(store.getActions()).toEqual(expectedAction);
			});
	});
});
