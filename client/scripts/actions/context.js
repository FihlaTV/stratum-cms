import es6Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';


/**	
 * Context modal
 */
export const SHOW_CONTEXT_MODAL = 'SHOW_CONTEXT_MODAL';
export const CONTEXT_ERROR = 'CONTEXT_ERROR';
export const SET_CONTEXTS = 'SET_CONTEXTS';
export const SET_ROLES = 'SET_ROLES';

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
					// const contexts = json.data.reduce((arr, x) => {
					// 	if(x.Unit.Register.RegisterID === 100){
					// 		arr.push(x);
					// 	}
					// 	return arr;
					// }, []);
					let units = {}, roles = [], roleIds = {};
					json.data.forEach(x => {
						if(!roleIds[x.Role.RoleID]){
							roles.push(x.Role);
						}
						roleIds[x.Role.RoleID] = true;
					});
					dispatch(setRoles(roles));
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

function setRoles(roles){
	return {
		type: SET_ROLES,
		roles: roles
	};
}

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
