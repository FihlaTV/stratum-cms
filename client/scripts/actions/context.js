import es6Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';

export const SHOW_CONTEXT_MODAL = 'SHOW_CONTEXT_MODAL';
export const CONTEXT_ERROR = 'CONTEXT_ERROR';
export const SET_ROLE = 'SET_ROLE';
export const SET_UNIT = 'SET_UNIT';
export const RECEIVE_CONTEXTS = 'RECEIVE_CONTEXTS';
export const SET_TARGET = 'SET_TARGET';

export function showContextModal(show) {
	return {
		type: SHOW_CONTEXT_MODAL,
		show: show
	};
}

export function setTarget(target){
	return {
		type: SET_TARGET,
		target
	};
}

export function initContextSelector(contexts, roleId, unitId, initial) {
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
