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

export function showContextModal(target) {
	return {
		type: SHOW_CONTEXT_MODAL,
		target: target
	};
}

export function fetchContexts() {
	return (dispatch, getState) => {
		return fetch(`${process.env.CLIENT_STRATUM_SERVER}/api/authentication/contexts`, { credentials: 'include' })
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					dispatch(receiveContexts(json.data));
					const state = getState();
					if(shouldSetUnit(state)){
						dispatch(setUnit(state.context.units[0].UnitID, state));
					}
				} else {
					const error = new Error(json.message);
					throw (error);
				}
			})
			.catch(error => { 
				dispatch(contextError(error));
				console.log('request failed', error); 
			});
	};
}
function receiveContexts(json) {
	//Remove all contexts not matching current register
	const registerContexts = json.filter(c => c.Unit.Register.RegisterID === REGISTER_ID);
	
	//Find all unique roles for current contexts
	const roles = registerContexts.reduce((roles, context) => {
		if (roles.every(x => x.RoleID !== context.Role.RoleID)) {
			roles.push(context.Role);
		}
		return roles;
	}, []);
	

	let ret = {
		type: RECEIVE_CONTEXTS,
		contexts: registerContexts,
		roles: roles,
	};
	
	if(roles.length === 1){
		ret.currentRole = roles[0].RoleID;
		ret.units = getUnits(registerContexts, ret.currentRole);
	}
	
	return ret;
}

function getUnits(contexts, roleId){
	return contexts.reduce((units, context) => {
			if (context.Role.RoleID === roleId) {
				units.push(context.Unit);
			}
			return units;
	}, []);
}

export function changeRole(roleId) {
	return (dispatch, getState) => {
		dispatch(setRole(roleId, getState()));
		const state = getState();
		if(shouldSetUnit(state)){
			dispatch(setUnit(state.context.units[0].UnitID, state));
		}
	};
}

function shouldSetUnit(state){
	const { currentUnit, currentRole, units } = state.context;
	return !currentUnit && currentRole && units && units.length === 1;
}

function setRole(roleId, state) {
	const { contexts } = state.context;
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
