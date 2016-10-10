import expect from 'expect';
import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';

const { CLIENT_STRATUM_SERVER } = process.env;
import * as actions from '../scripts/actions/login.js';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('login async actions', () => {
	afterEach(() => {
		nock.cleanAll();
	});

	it('creates a LOGIN_ERROR on failed logout', () => {
		nock(CLIENT_STRATUM_SERVER)
			.get('/api/authentication/logout')
			.query(true)
			.reply(200, { success: false });

		const expectedActions = [
			{ type: actions.LOGIN_ERROR },
		];

		const store = mockStore({});

		return store.dispatch(actions.logoutFromStratum())
			.then(() => {
				expect(store.getActions()).toMatch(expectedActions);
			});
	});
});
