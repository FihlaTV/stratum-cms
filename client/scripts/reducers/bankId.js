// import { LoginMethod, SET_LOGIN_METHOD, INPUT_PERSONAL_NUMBER, RESET_STATE } from '../actions/actions.js';
import { LoginStages, ADVANCE_LOGIN, SET_BID_STAGE, SET_BID_STATUS } from '../actions/actions.js';

const initialState = {
	bidStage: LoginStages.INPUT_PERSONAL_NUMBER 
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
		default:
			return state;
	}
}