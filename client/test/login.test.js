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

describe('actions', () => {
	it('should create an action to set current protocol', () => {
		const https = true;
		const expectedAction = {
			type: actions.SET_HTTPS_FLAG,
			https,
		};
		expect(actions.setCurrentProtocol(https)).toEqual(expectedAction);
	});
	it('should create an action to show login modal', () => {
		const showLoginModal = true;
		const expectedAction = {
			type: actions.SHOW_LOGIN_MODAL,
			showLoginModal,
		};
		expect(actions.showLoginModal(showLoginModal)).toEqual(expectedAction);
	});
	it('should create an action to set login method', () => {
		const loginMethod = actions.LoginMethod.BANK_ID;
		const expectedAction = {
			type: actions.SET_LOGIN_METHOD,
			loginMethod,
		};
		expect(actions.setLoginMethod(loginMethod)).toEqual(expectedAction);
	});
	it('should create an action to reset state', () => {
		const closeModal = true;
		const expectedAction = {
			type: actions.RESET_STATE,
			close: closeModal,
		};
		expect(actions.resetState(closeModal)).toEqual(expectedAction);
	});
	it('should create an action to set has next state', () => {
		const hasNextState = true;
		const expectedAction = {
			type: actions.HAS_NEXT_STATE,
			hasNextState,
		};
		expect(actions.setHasNextState(hasNextState)).toEqual(expectedAction);
	});
	it('should create an action to set error message', () => {
		const error = new Error('test error message');
		const expectedAction = {
			type: actions.LOGIN_ERROR,
			error,
		};
		expect(actions.loginError(error)).toEqual(expectedAction);
	});
});
