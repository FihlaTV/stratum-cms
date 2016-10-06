import expect from 'expect';
import * as actions from '../scripts/actions/login.js';

describe('actions', () => {
	it('should complete this test', () => {
		expect(true).toEqual(true);
	});
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
