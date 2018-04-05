import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';

import * as actions from '../scripts/actions/menu.js';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const { LOCAL_MOCK_URL } = process.env;

describe('menu async actions', () => {
	afterEach(() => {
		nock.cleanAll();
	});

	test(
        'creates a RECEIVE_MENU_ITEMS action with all menu items on menu fetch',
        () => {
	const menuItems = [
		{
			url: '/contact',
			label: 'Contact',
			key: 'contact',
		},
		{
			url: '/about',
			label: 'About',
			key: 'about',
		},
		{
			url: '/foer-professionen',
			label: 'För professionen',
			key: 'foer-professionen',
			items: [
				{
					label: 'Frågor och svar',
					key: 'fragor-och-svar',
					url: '/foer-professionen/fragor-och-svar/p/jX3LWMnM',
					pageKey: 'jX3LWMnM',
				},
				{
					url: '/foer-professionen/nyheter-nyhetssida/p/rkx2LW2f',
					label: 'Nyheter',
					key: 'nyheter',
					pageKey: 'rkx2LW2f',
				},
				{
					url: '/about',
					label: 'Patient',
					key: 'patient',
					pageKey: 'rkbhLbhz',
					items: [
						{
							url: '/foer-professionen/sub-page/p/ryf2UZ2f',
							label: 'Sub Page',
							key: 'sub-page',
							pageKey: 'ryf2UZ2f',
						}, {
							url: '/about/more',
							label: 'Sub Page 2',
							key: 'sub-page2',
							pageKey: 'ryf2UZ2f',
						},
					],
				},
			],
		},
	];
	nock(LOCAL_MOCK_URL)
                .get('/api/menu')
                .reply(200, {
	success: true,
	data: menuItems,
});

	const expectedActions = [
                { type: actions.RECEIVE_MENU_ITEMS, items: menuItems },
	];

	const store = mockStore({ menu: { items: [] } });

	return store.dispatch(actions.fetchMenuItems())
                .then(() => {
	expect(store.getActions()).toMatchObject(expectedActions);
});
}
    );
});
