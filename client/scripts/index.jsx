import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import Application from './containers/App';
import loginApp from './reducers/reducers';

// Webpack dependencies
// import 'jquery'; // not needed, bundled with bootstrap
import 'bootstrap';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import '../../public/styles/site.less';

//Temporary Masonry solution until full React version of site...
window.Masonry = Masonry;
window.imagesLoaded = imagesLoaded;
window.Stratum = {};

const mainContainer = document.getElementById('login-button-react');

let store = compose(
		applyMiddleware(thunkMiddleware),
	    window.devToolsExtension ? window.devToolsExtension() : f => f
	)(createStore)(loginApp);

if(module.hot){
	module.hot.accept('./reducers/reducers.js', () => {
      const nextReducer = require('./reducers/reducers.js');
      store.replaceReducer(nextReducer);
    });
}

if(mainContainer){
	render(
		<Provider store={store}>
			<Application />
		</Provider>, 
		mainContainer
	);
}
