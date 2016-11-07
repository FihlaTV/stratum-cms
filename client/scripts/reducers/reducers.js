import login from './login';
import bankId from './bankId';
import context from './context';
import messages from './messages';
import menu from './menu';
import page from './page';
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

export default combineReducers({
	login,
	bankId,
	context,
	messages,
	menu,
	routing,
	page,
});
