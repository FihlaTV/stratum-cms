import * as actions from '../scripts/actions/news';
import newsReducer from '../scripts/reducers/news';
import expect from 'expect';

describe('News reducer test for case NEWS', () => {
	it('When no news exists it returns the string "loading"', () => {
		expect(newsReducer(undefined, {}))
			.toEqual({
				loading: true,
				newsArticle: { loading: true },
				itemsPerYear: { all: 0 },
				fetchedItems: false,
				title: 'Nyheter och meddelanden',
			});
	});

	it('When initilized by an action with the type NEWS, it creates state object', () => {
		const mockNewsArr = [
			{ _id: '581719cfe87f6bd027229e28', slug: 'bacon-ipsum4', title: 'Bacon ipsum4', publishedDate: '2015-10-25T22:00:00.000Z', content: { lead: 'Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!4' } },
			{ _id: '581719cfe87f6bd027229e2d', slug: 'bacon-ipsum9', title: 'Bacon ipsum9', publishedDate: '2011-10-25T22:00:00.000Z', content: { lead: 'Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!9' } },
			{ _id: '581719cfe87f6bd027229e32', slug: 'bacon-ipsum14', title: 'Bacon ipsum14', publishedDate: '2010-10-25T22:00:00.000Z', content: { lead: 'Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!14' } },
		];
		const mockItemsPerYear = { all: mockNewsArr.length, 2010: 1, 2011: 1, 2015: 1 };
		const reducer = newsReducer(undefined, { type: actions.RECEIVE_NEWS_ITEMS, items: mockNewsArr, itemsPerYear: mockItemsPerYear });
		expect(reducer).toBeA('object');
		expect(reducer.items).toEqual(mockNewsArr);
		expect(reducer.itemsPerYear).toEqual(mockItemsPerYear);
	});
});
