import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import Resources from '../scripts/components/Resources';

describe('Tests for Resource component', () => {
	it('Will contain a <h2>Dokument att ladda ner</h2>', () => {
		const wrapper = shallow(<Resources />);

		expect(wrapper.contains(<h2>Dokument att ladda ner</h2>));
	});
});
