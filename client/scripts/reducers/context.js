import { SHOW_CONTEXT_MODAL, CONTEXT_ERROR, SET_CONTEXTS, 
	SET_ROLES, SET_ROLE, SET_UNITS, SET_UNIT, SET_TARGET, 
	SET_CURRENT_CONTEXT, RECEIVE_CONTEXTS, 
	STRATUM_CONTEXT, SYNC_FLAG } from '../actions/context';

const initialState = {
	initial: false,
	show: false,
	units: [],
	roles: [],
	contexts: []
};

export default (state = initialState, action) => {
	switch (action.type){
        case SHOW_CONTEXT_MODAL:
			let nextState = {
				show: action.show
			};
			if(!action.show){
				nextState.initial = false;
			}
            return Object.assign({}, state, nextState);
		case RECEIVE_CONTEXTS:
			return Object.assign({}, state, {
				contexts: action.contexts,
				roles: action.roles,
				currentRole: action.currentRole,
				units: action.units,
				currentUnit: action.currentUnit,
				initial: action.initial
			});
		default:
			return state;
		// case CONTEXT_ERROR: 
		// 	return Object.assign({}, state, {
		// 		error: action.error
		// 	});
		// case RECEIVE_CONTEXTS: 
		// 	return Object.assign({}, state, {
		// 		contexts: action.contexts,
		// 		roles: action.roles || [],
		// 		currentRole: action.currentRole,
		// 		units: action.units || []
		// 	});
		case SET_TARGET: 
			return Object.assign({}, state, {
				target: action.target
			});
		case SET_ROLE: 
			return Object.assign({}, state, {
				currentRole: action.roleId,
				units: action.units,
				initial: false,
				// isDirty: true,
				currentUnit: undefined,
				currentContext: undefined
			});
		case SET_UNIT: 
			return Object.assign({}, state, {
				initial: false,
				currentUnit: action.unitId,
				currentContext: action.context,
				// isDirty: true
			});
		// case STRATUM_CONTEXT:
		// 	return Object.assign({}, state, {
		// 		stratumContext: action.context,
		// 		isDirty: false,
		// 		show: false
		// 	});
		// case SYNC_FLAG:
		// 	return Object.assign({}, state, {
		// 		isSyncing: action.isSyncing
		// 	});
      	// default:
		// 	return state;
	}
};
