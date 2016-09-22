import login from './login';
import bankId from './bankId';
import context from './context';
import messages from './messages';
import { combineReducers } from 'redux';

export default combineReducers({
	login,
	bankId,
	context,
	messages,
});
