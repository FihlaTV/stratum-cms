import { SHOW_CONTEXT_MODAL, CONTEXT_ERROR, SET_CONTEXTS, SET_ROLES, SET_ROLE, SET_UNITS, SET_UNIT } from '../actions/context';

const initialState = {
	showModal: false,
	units: [],
	roles: [],
	contexts: [],
	currentRole: '',
	currentUnit: ''
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
		case SET_ROLE: 
			return Object.assign({}, state, {
				currentRole: action.roleId
			});
		case SET_UNIT: 
			return Object.assign({}, state, {
				currentUnit: action.unitId
			});
		case SET_UNITS:
			return Object.assign({}, state, {
				units: action.units
			});
      	default:
			return state;
	}
};
