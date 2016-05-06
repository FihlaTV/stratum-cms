import es6Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';


/**	
 * Context modal
 */
export const SHOW_CONTEXT_MODAL = 'SHOW_CONTEXT_MODAL';
export const CONTEXT_ERROR = 'CONTEXT_ERROR';
export const SET_CONTEXTS = 'SET_CONTEXTS';
export const SET_ROLES = 'SET_ROLES';
export const SET_ROLE = 'SET_ROLE';
export const SET_UNITS = 'SET_UNITS';
export const SET_UNIT = 'SET_UNIT';

export function showContextModal(target){
	return {
		type: SHOW_CONTEXT_MODAL,
		target: target
	};
}

export function fetchContexts() {
	return (dispatch) => {
		return fetch(`${process.env.CLIENT_STRATUM_SERVER}/api/authentication/contexts`, { credentials: 'include' })
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					const contexts = json.data && json.data.filter(c => c.Unit.Register.RegisterID === REGISTER_ID);
					dispatch(setContexts(contexts));
					dispatch(setRoles(contexts));
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

function setRoles(json){
	return {
		type: SET_ROLES,
		roles: json.reduce((roles, context) => {
			if(roles.every(x => x.RoleID !== context.Role.RoleID)){
				roles.push(context.Role);
			}
			return roles;
		}, [])
	};
}

function setUnits(state, roleId){
	return {
		type: SET_UNITS,
		units: state.context.contexts.reduce((units, context) => {
			if(context.Role.RoleID === roleId){
				units.push(context.Unit);
			}
			return units;
		}, [])
	}
}

export function changeRole(roleId){
	return (dispatch, getState) => {
		dispatch(setRole(roleId));
		dispatch(setUnits(getState(), roleId));
	}
}

function setRole(roleId){
	return {
		type: SET_ROLE,
		roleId
	}
}

export function setUnit(unitId){
	return {
		type: SET_UNIT,
		unitId: unitId
	};
}

const REGISTER_ID = 100;

function setContexts(contexts){
	return {
		type: SET_CONTEXTS,
		contexts: contexts
	};
}

export function contextError(error){
	return {
		type: CONTEXT_ERROR,
		error: error 
	};
}
