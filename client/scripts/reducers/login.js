import { LoginMethod, SET_LOGIN_METHOD, SET_SITHS_STAGE, RESET_STATE,  } from '../actions/actions';

const initialState = {
	loginMethod: LoginMethod.NOT_SELECTED
};

export default (state = initialState, action) => {
	switch (action.type){
		case SET_LOGIN_METHOD:
			return Object.assign({}, state, {
				loginMethod: action.loginMethod
			});
		case RESET_STATE:
			return initialState;
		case SET_SITHS_STAGE:
			return Object.assign({}, state, {
				sithsState: action.sithsState
			});
		default:
			return state;
	}
}


