import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import Application from './containers/App.jsx';
import loginApp from './reducers/reducers.js';

const mainContainer = document.getElementById('login-page');

let store = compose(
		applyMiddleware(thunkMiddleware),
	    window.devToolsExtension ? window.devToolsExtension() : f => f
	)(createStore)(loginApp);

if(mainContainer){
	render(
		<Provider store={store}>
			<Application />
		</Provider>, 
		mainContainer
	);
}
