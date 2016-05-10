import { SHOW_CONTEXT_MODAL, CONTEXT_ERROR, SET_CONTEXTS, SET_ROLES, SET_ROLE, SET_UNITS, SET_UNIT, SET_CURRENT_CONTEXT, RECEIVE_CONTEXTS } from '../actions/context';

const initialState = {
	showModal: false,
	units: [],
	roles: [],
	contexts: []
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
		case RECEIVE_CONTEXTS: 
			return Object.assign({}, state, {
				contexts: action.contexts,
				roles: action.roles || [],
				currentRole: action.currentRole,
				units: action.units || []
			});
		case SET_ROLE: 
			return Object.assign({}, state, {
				currentRole: action.roleId,
				units: action.units,
				currentUnit: undefined,
				currentContext: undefined
			});
		case SET_UNIT: 
			return Object.assign({}, state, {
				currentUnit: action.unitId,
				currentContext: action.context
			});
      	default:
			return state;
	}
};
