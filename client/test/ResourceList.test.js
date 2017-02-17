import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import ResourceList from '../scripts/components/ResourceList';

describe('Tests for Resource component', () => {
	const resources = [
		{
			title: 'En annan fil!',
			description: 'En annan fil!',
			fileUrl: '/temp/r/En-annan-fil--r1JES6ZZl.jpg',
			fileType: 'image',
		},
		{
			title: 'En fil!',
			description: 'En fil ',
			fileUrl: '/temp/r/En-fil--HJZWSTZWl.JPG',
			fileType: 'image',
		},
	];

	const wrapper = shallow(<ResourceList resources={resources}/>);
	it('Will contain a <h2>Dokument att ladda ner</h2>', () => {
		expect(wrapper.contains(<h2>Dokument att ladda ner</h2>));
	});

	it('Will contain a <li> with the info of the first resource item.', () => {
		const expected = (
			<li>
				<i className="resource-icon resource-image"></i>
				<a href="/temp/r/En-annan-fil--r1JES6ZZl.jpg">En annan fil!</a>
				<p>En annan fil!</p>
			</li>
		);
		expect(wrapper.contains(expected)).toEqual(true);
	});
});
