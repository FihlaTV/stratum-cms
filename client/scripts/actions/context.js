import es6Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';


/**	
 * Context modal
 */
const REGISTER_ID = 100;

export const SHOW_CONTEXT_MODAL = 'SHOW_CONTEXT_MODAL';
export const CONTEXT_ERROR = 'CONTEXT_ERROR';
export const SET_ROLE = 'SET_ROLE';
export const SET_UNIT = 'SET_UNIT';
export const RECEIVE_CONTEXTS = 'RECEIVE_CONTEXTS';

export function showContextModal(show) {
	return {
		type: SHOW_CONTEXT_MODAL,
		show: show
	};
}

export const SET_TARGET = 'SET_TARGET';

export function setTarget(target){
	return {
		type: SET_TARGET,
		target
	};
}

export function initContextSelector(contexts, roleId, unitId, initial) {
	//Remove all contexts not matching current register
	// const registerContexts = json.filter(c => c.Unit.Register.RegisterID === REGISTER_ID);

	//Find all unique roles for current contexts
	const roles = contexts.reduce((roles, context) => {
		if (roles.every(x => x.RoleID !== context.Role.RoleID)) {
			roles.push(context.Role);
		}
		return roles;
	}, []);

	let ret = {
		type: RECEIVE_CONTEXTS,
		contexts: contexts,
		roles: roles,
		initial: !!(initial && roleId && unitId)
	};
	ret.currentRole = roles.length === 1 ? roles[0].RoleID : roleId;
	if (ret.currentRole) {
		ret.units = getUnits(contexts, ret.currentRole);
	}
	if(ret.units){
		ret.currentUnit = ret.units.length === 1 ? ret.units[0] : unitId;
	}
	
	return ret;
}

function getUnits(contexts, roleId) {
	return contexts.reduce((units, context) => {
		if (context.Role.RoleID === roleId) {
			units.push(context.Unit);
		}
		return units;
	}, []);
}

export function roleChange(roleId) {
	return (dispatch, getState) => {
		dispatch(setRole(roleId, getState().context.contexts));
		const state = getState();
		if (shouldSetUnit(state)) {
			dispatch(setUnit(state.context.units[0].UnitID, state));
		}
	};
}

function shouldSetUnit(state) {
	const { currentUnit, currentRole, units } = state.context;
	return !currentUnit && currentRole && units && units.length === 1;
}

function setRole(roleId, contexts) {
	return {
		type: SET_ROLE,
		roleId,
		units: contexts.reduce((units, context) => {
			if (context.Role.RoleID === roleId) {
				units.push(context.Unit);
			}
			return units;
		}, [])
	};
}

function setUnit(unitId, state) {
	const { currentRole, contexts } = state.context;
	return {
		type: SET_UNIT,
		unitId: unitId,
		context: contexts.find(c => c.Role.RoleID === currentRole && c.Unit.UnitID === unitId)
	};
}

export function unitChange(unitId) {
	return (dispatch, getState) => {
		dispatch(setUnit(unitId, getState()));
	};
}

export function contextError(error) {
	return {
		type: CONTEXT_ERROR,
		error: error
	};
}

export const STRATUM_CONTEXT = 'STRATUM_CONTEXT';

function setStratumContext(json) {
	return {
		type: STRATUM_CONTEXT,
		context: json,
		syncingStratum: false
	};
}

export const SYNC_FLAG = 'SYNC_FLAG';

function setStratumSyncFlag(flag) {
	return {
		type: SYNC_FLAG,
		isSyncing: flag
	};
}

// export function syncContext(contextId) {
// 	return (dispatch, getState) => {
// 		dispatch(setStratumSyncFlag(true));
// 		return fetch(`${process.env.CLIENT_STRATUM_SERVER}/api/authentication/context`, {
// 			credentials: 'include',
// 			method: 'PUT',
// 			headers: {
// 				'Content-Type': 'application/json'
// 			},
// 			body: JSON.stringify({
// 				Context: {
// 					ContextID: contextId
// 				}
// 			})
// 		})
// 			.then(res => res.json())
// 			.then(json => {
// 				if (json.success) {
// 					dispatch(setStratumSyncFlag(false));
// 					dispatch(setStratumContext(json.data));
// 				} else {
// 					const error = new Error(json.message);
// 					throw (error);
// 				}
// 			})
// 			.catch(error => {
// 				dispatch(setStratumSyncFlag(false));
// 				dispatch(contextError(error));
// 				console.log('request failed', error);
// 			});
// 	};
// }
