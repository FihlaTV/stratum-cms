import login from './login';
import bankId from './bankId';
import context from './context';
import { combineReducers } from 'redux';

export default combineReducers({
	login,
	bankId,
	context
});
