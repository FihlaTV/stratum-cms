import React from 'react';
import ReactDOM from 'react-dom';
import Application from './components/Application';
const loginNav = document.getElementById('login-nav');

if(loginNav){
	ReactDOM.render(
		<Application />, 
		loginNav
	);
}
