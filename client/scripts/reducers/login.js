import { LoginMethod, SET_LOGIN_METHOD, SET_SITHS_STATUS, RESET_STATE, HAS_NEXT_STATE } from '../actions/actions';

const initialState = {
	loginMethod: LoginMethod.NOT_SELECTED,
	hasNextState: true,
	sithsStatus: 'SITHS_INTRO'
};

export default (state = initialState, action) => {
	switch (action.type){
		case SET_LOGIN_METHOD:
			return Object.assign({}, state, {
				loginMethod: action.loginMethod
			});
		case RESET_STATE:
			return initialState;
		case SET_SITHS_STATUS:
			return Object.assign({}, state, {
				sithsStatus: action.sithsStatus
			});
		case HAS_NEXT_STATE: 
			return Object.assign({}, state, {
				hasNextState: action.hasNextState
			});
		default:
			return state;
	}
}


