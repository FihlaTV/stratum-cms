import login from './login';
import bankId from './bankId';
import context from './context';
import messages from './messages';
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

export default combineReducers({
	login,
	bankId,
	context,
	messages,
	routing,
});
