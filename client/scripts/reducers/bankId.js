import { LoginStages, INPUT_PERSONAL_NUMBER, SET_PERSONAL_NUMBER_VALIDITY, SET_BID_STAGE, SET_BID_STATUS, SET_BID_ORDER, RESET_STATE, INCREMENT_BID_TRIES, SET_USER_NAME } from '../actions/actions';

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
		case INCREMENT_BID_TRIES:
			return Object.assign({}, state, {
				bidTries: state.bidTries+1
			});
		case INPUT_PERSONAL_NUMBER: 
			return Object.assign({}, state, {
				personalNumber: action.personalNumber
			});
		case SET_PERSONAL_NUMBER_VALIDITY:
			return Object.assign({}, state, {
				personalNumberValidity: action.validity
			})
		case SET_USER_NAME:
			return Object.assign({}, state, {
				userName: action.userName
			});
		case RESET_STATE:
			return initialState;
		default:
			return state;
	}
}