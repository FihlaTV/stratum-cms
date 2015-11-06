import { LoginMethods, SET_LOGIN_METHOD, INPUT_PERSONAL_NUMBER, RESET_STATE } from '../actions/actions.js';
import { combineReducers } from 'redux';

const initialState = {
	// loginMethod: LoginMethods.SITHS_CARD
};

function login(state = initialState, action){
	switch (action.type){
		case SET_LOGIN_METHOD:
			return Object.assign({}, state, {
				loginMethod: action.loginMethod
			});
		case INPUT_PERSONAL_NUMBER: 
			return Object.assign({}, state, {
				personalNumber: action.personalNumber
			});
		case RESET_STATE:
			return {};
		default:
			return state;
	}
}

export default combineReducers({login});
