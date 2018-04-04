import React from 'react';
import { shallow } from 'enzyme';
import NewsListItem from '../scripts/components/NewsListItem';

describe('Tests for NewsListItem component', () => {
	const article = {
		_id: '581719cfe87f6bd027229e28',
		slug: 'bacon-ipsum4',
		title: 'Bacon ipsum4',
		publishedDate: '2015-10-25T22:00:00.000Z',
		content: {
			lead: 'Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!4',
		},
	};
	const wrapper = shallow(
		<NewsListItem
			slug={article.slug}
			title={article.title}
			publishedDate={article.publishedDate}
			content={article.content}
		/>
	);

	test('Contains the wrapper div', () => {
		expect(wrapper.find('div.news-list-item')).toBeTruthy();
		expect(wrapper.find('div.news-list-item').children().length).toEqual(1);
	});

	test('Contains the link too the article', () => {
		expect(wrapper.find('a')).toBeTruthy();
	});

	test('Contains a <div> with the class news-list-item-content', () => {
		expect(wrapper.find('div.news-list-item-content')).toBeTruthy();
		expect(wrapper.find('div.news-list-item-content').children().length).toEqual(3);
	});

	test('Contains a <h2> with the title of the article', () => {
		expect(wrapper.contains(<h2>Bacon ipsum4</h2>)).toEqual(true);
	});

	test('Contains a <p> with published-at class and date', () => {
		expect(wrapper.contains(<p className="published-at">2015-10-25</p>)).toEqual(true);
	});

	test('Contains a <p> with lead class and the content lead text', () => {
		expect(wrapper.contains(<p className="lead">{article.content.lead}</p>)).toEqual(true);
	});

});
