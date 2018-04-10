import React from 'react';
import { shallow } from 'enzyme';
import ResourceList, { Resource } from '../scripts/components/ResourceList';

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

	const wrapper = shallow(<ResourceList resources={resources} />);

	test('Will contain a <h2> with default title "Dokument att ladda ner"', () => {
		expect(wrapper.contains(<h2>Dokument att ladda ner</h2>));
	});

	test('Should render two <Resource /> components', () => {
		expect(wrapper.find(Resource).length).toBe(resources.length);
	});
});
