import { LoginMethod, SET_LOGIN_METHOD, INPUT_PERSONAL_NUMBER, RESET_STATE, SET_PERSONAL_NUMBER_VALIDITY } from '../actions/actions.js';

const initialState = {
	loginMethod: LoginMethod.NOT_SELECTED
};

export default (state = initialState, action) => {
	switch (action.type){
		case SET_LOGIN_METHOD:
			return Object.assign({}, state, {
				loginMethod: action.loginMethod
			});
		case INPUT_PERSONAL_NUMBER: 
			return Object.assign({}, state, {
				personalNumber: action.personalNumber
			});
		case SET_PERSONAL_NUMBER_VALIDITY:
			return Object.assign({}, state, {
				personalNumberValidity: action.validity
			})
		case RESET_STATE:
			return initialState;
		default:
			return state;
	}
}


