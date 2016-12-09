import {
	LoginMethod,
	LOGIN_ERROR,
	SET_LOGIN_METHOD,
	SET_SITHS_STATUS,
	RESET_STATE,
	HAS_NEXT_STATE,
	SET_CONTEXT,
	SHOW_LOGIN_MODAL,
	SET_USER_INFO,
	CONTEXT_IS_LOADING,
	SET_HTTPS_FLAG,
	SET_TIMELEFT,
	SET_SHRINK_UNIT_NAME,
	SET_ACTIVE_STATUS,
	UPDATE_SITHS_NEW_CARD,
	} from '../actions/login';

const { CLIENT_DEMO_USERNAME } = process.env;

const demoUser = CLIENT_DEMO_USERNAME;

const initialState = {
	loginMethod: LoginMethod.NOT_SELECTED,
	hasNextState: true,
	showLoginModal: false,
	shrinkUnitName: true,
	sithsStatus: 'SITHS_INTRO',
	sithsNewCard: {
		valid: false,
		username: '',
		password: '',
	},
	demoUser,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_LOGIN_METHOD:
			return Object.assign({}, state, {
				loginMethod: action.loginMethod,
			});
		case RESET_STATE:
			return Object.assign({}, initialState, {
				showLoginModal: !action.close,
				https: !!state.https,
			});
		case SET_SITHS_STATUS:
			return Object.assign({}, state, {
				sithsStatus: action.sithsStatus,
			});
		case HAS_NEXT_STATE:
			return Object.assign({}, state, {
				hasNextState: action.hasNextState,
			});
		case LOGIN_ERROR:
			return Object.assign({}, state, {
				error: action.error,
			});
		case SHOW_LOGIN_MODAL:
			return Object.assign({}, state, {
				showLoginModal: action.showLoginModal,
			});
		case SET_HTTPS_FLAG:
			return Object.assign({}, state, {
				https: action.https,
			});
		case SET_USER_INFO:
			return Object.assign({}, state, {
				context: action.context,
				wrongRegister: action.wrongRegister,
				contexts: action.contexts,
				contextIsLoading: false,
				initial: action.initial,
			});
		case SET_CONTEXT:
			return Object.assign({}, state, {
				context: action.context,
				wrongRegister: false,
			});
		case CONTEXT_IS_LOADING:
			return Object.assign({}, state, {
				contextIsLoading: action.isLoading,
			});
		case SET_TIMELEFT:
			return Object.assign({}, state, {
				timeleft: action.timeleft,
				showTimeleft: action.showTimeleft,
			});
		case SET_SHRINK_UNIT_NAME:
			return Object.assign({}, state, {
				shrinkUnitName: action.shrink,
			});
		case SET_ACTIVE_STATUS:
			return Object.assign({}, state, {
				sessionIsActive: action.activeStatus,
			});
		case UPDATE_SITHS_NEW_CARD:
			return Object.assign({}, state, {
				sithsNewCard: Object.assign({}, state.sithsNewCard, action.newCard),
			});
		default:
			return state;
	}
};


