import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import Resources from '../scripts/components/Resources';

describe('Tests for Resource component', () => {
	const resources = [
		{
			_id: '58244527f65d47540fdb27a3',
			updatedBy: '580db9ed0cfd843c149ee51e',
			updatedAt: '2016-11-10T10:00:14.746Z',
			createdAt: '2016-11-10T10:00:07.290Z',
			description: 'En annan fil!',
			title: 'En annan fil!',
			__v: 0,
			fileUrl: '/temp/r/En-annan-fil--r1JES6ZZl.jpg',
			hasFile: true,
			shortId: 'r1JES6ZZl',
			file: {
				filename: 'r/En-annan-fil--r1JES6ZZl.jpg',
				originalname: 'rise.jpg',
				path: 'public/temp',
				size: 161012,
				filetype: 'image/jpeg',
			},
		},
		{
			_id: '582444f8f65d47540fdb27a2',
			updatedBy: '580db9ed0cfd843c149ee51e',
			updatedAt: '2016-11-10T09:59:38.805Z',
			createdAt: '2016-11-10T09:59:20.835Z',
			description: 'En fil ',
			title: 'En fil!',
			__v: 0,
			fileUrl: '/temp/r/En-fil--HJZWSTZWl.JPG',
			hasFile: true,
			shortId: 'HJZWSTZWl',
			file: {
				filename: 'r/En-fil--HJZWSTZWl.JPG',
				originalname: 'kladdkaka.JPG',
				path: 'public/temp',
				size: 14793,
				filetype: 'image/jpeg',
			},
		},
	];

	const wrapper = shallow(<Resources resources={resources}/>);
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
