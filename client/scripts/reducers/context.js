import { SHOW_CONTEXT_MODAL, CONTEXT_ERROR, SET_CONTEXTS, SET_ROLES } from '../actions/context';

const initialState = {
	showModal: false
};

export default (state = initialState, action) => {
	switch (action.type){
        case SHOW_CONTEXT_MODAL:
            return Object.assign({}, state, {
                showModal: !state.showModal,
				modalTarget: action.target
            });
		case CONTEXT_ERROR: 
			return Object.assign({}, state, {
				error: action.error
			});
		case SET_CONTEXTS:
			return Object.assign({}, state, {
				contexts: action.contexts
			});
		case SET_ROLES: 
			return Object.assign({}, state, {
				roles: action.roles
			});
      	default:
			return state;
	}
};
