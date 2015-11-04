import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Application from './containers/App';
import loginApp from './reducers/reducers.js';

const mainContainer = document.getElementById('login-page');

let store = createStore(loginApp);

if(mainContainer){
	render(
		<Provider store={store}>
			<Application />
		</Provider>, 
		mainContainer
	);
}
