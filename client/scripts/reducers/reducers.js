import login from './login';
import bankId from './bankId';
import context from './context';
import messages from './messages';
import news from './news';
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';


export default combineReducers({
	login,
	bankId,
	context,
	messages,
	news,
	routing,
});
