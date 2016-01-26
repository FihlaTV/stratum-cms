// import { LoginMethod, SET_LOGIN_METHOD, INPUT_PERSONAL_NUMBER, RESET_STATE } from '../actions/actions.js';
import { LoginStages, ADVANCE_LOGIN } from '../actions/actions.js';

const initialState = {
	loginStage: LoginStages.INPUT_PERSONAL_NUMBER 
};

export default (state = initialState, action) => {
	switch (action.type){
		case ADVANCE_LOGIN : 
			return Object.assign({}, state, {
				loginStage: action.loginStage
			});
		// case SET_LOGIN_METHOD:
		// 	return Object.assign({}, state, {
		// 		loginMethod: action.loginMethod
		// 	});
		// case INPUT_PERSONAL_NUMBER: 
		// 	return Object.assign({}, state, {
		// 		personalNumber: action.personalNumber
		// 	});
		// case RESET_STATE:
		// 	return initialState;
		default:
			return state;
	}
}