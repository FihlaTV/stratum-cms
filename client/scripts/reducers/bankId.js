// import { LoginMethod, SET_LOGIN_METHOD, INPUT_PERSONAL_NUMBER, RESET_STATE } from '../actions/actions.js';
import { LoginStages, ADVANCE_LOGIN, SET_BID_STAGE, SET_BID_STATUS, SET_BID_ORDER, BID_ERROR, RESET_STATE, INCREMENT_BID_TRIES } from '../actions/actions.js';

const initialState = {
	bidStage: LoginStages.INPUT_PERSONAL_NUMBER,
	bidTries: 0
};

export default (state = initialState, action) => {
	switch (action.type){
        case SET_BID_STAGE:
            return Object.assign({}, state, {
                bidStage: action.bidStage
            });
        case SET_BID_STATUS:
            return Object.assign({}, state, {
                status: action.status
            });
		case SET_BID_ORDER: 
			return Object.assign({}, state, {
				orderRef: action.orderRef,
				autoStartToken: action.autoStartToken
			});
		case BID_ERROR:
			return Object.assign({}, state, {
				error: action.error,
				bidStage: LoginStages.LOGIN_ERROR
			});
		case INCREMENT_BID_TRIES:
			return Object.assign({}, state, {
				bidTries: state.bidTries+1
			});
		case RESET_STATE:
			return initialState;
		default:
			return state;
	}
}