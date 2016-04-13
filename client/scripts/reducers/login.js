import { 
	LoginMethod, 
	LoginStages, 
	LOGIN_ERROR, 
	SET_LOGIN_METHOD, 
	SET_SITHS_STATUS, 
	RESET_STATE, 
	HAS_NEXT_STATE,
	SHOW_LOGIN_MODAL, 
	SET_HTTPS_FLAG
	} from '../actions/actions';

const initialState = {
	loginMethod: LoginMethod.NOT_SELECTED,
	hasNextState: true,
	showLoginModal: false,
	sithsStatus: 'SITHS_INTRO'
};

export default (state = initialState, action) => {
	switch (action.type){
		case SET_LOGIN_METHOD:
			return Object.assign({}, state, {
				loginMethod: action.loginMethod
			});
		case RESET_STATE:
			return Object.assign({}, initialState, {
				showLoginModal: !action.close
			});
		case SET_SITHS_STATUS:
			return Object.assign({}, state, {
				sithsStatus: action.sithsStatus
			});
		case HAS_NEXT_STATE: 
			return Object.assign({}, state, {
				hasNextState: action.hasNextState
			});
		case LOGIN_ERROR:
			return Object.assign({}, state, {
				error: action.error
			});
		case SHOW_LOGIN_MODAL:
			return Object.assign({}, state, {
				showLoginModal: action.showLoginModal
			});
		case SET_HTTPS_FLAG:
			return Object.assign({}, state, {
				https: action.https
			});
		default:
			return state;
	}
}


