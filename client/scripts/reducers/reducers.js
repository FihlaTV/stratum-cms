import { LoginMethods, SET_LOGIN_METHOD, INPUT_PERSONAL_NUMBER } from '../actions/actions.js';

const initialState = {
	loginMethod: null
};

export function loginApp(state = initialState, action){
	switch (action.type){
		case SET_LOGIN_METHOD:
			return Object.assign({}, state, {
				loginMethod: action.loginMethod
			});
		case INPUT_PERSONAL_NUMBER: 
			return Object.assign({}, state, {
				personalNumber: action.personalNumber
			});
		default:
			return state;
	}
}
