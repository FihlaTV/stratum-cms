import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import Application from './containers/App';
import WidgetWrapper from './components/WidgetWrapper';
import reducers from './reducers/reducers';
import es6Promise from 'es6-promise';
import find from 'array.prototype.find';
import Messages from './containers/Messages';
import cookies from 'js-cookie';
import ReactGA from 'react-ga';
// React Router
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router } from 'react-router';
import routes from './routes';

// Webpack dependencies
// import 'jquery'; // not needed, bundled with bootstrap
import 'bootstrap';

// Polyfills
find.shim();
es6Promise.polyfill();

const stratumSessionCookie = 'stratum-session';
const { CLIENT_COOKIE_DOMAIN, CLIENT_GA_PROPERTY } = process.env;
const cookieConf = { domain: CLIENT_COOKIE_DOMAIN };
const mainContainer = document.getElementById('login-button-react');
const messageContainer = document.getElementById('message-container');
const routerContainer = document.getElementById('react-container');
const keystoneWidgets = document.querySelectorAll('.keystone-widget');

let store = compose(
		applyMiddleware(thunkMiddleware),
		window.devToolsExtension ? window.devToolsExtension() : f => f
	)(createStore)(reducers);

const history = syncHistoryWithStore(browserHistory, store);

// Add hot reloading if hot reloading module is initialized.
if (module.hot) {
	module.hot.accept('./reducers/reducers.js', () => {
		const nextReducer = require('./reducers/reducers.js').default;
		store.replaceReducer(nextReducer);
	});
}

// Set a unique window name for stratum session cookie
if (!window.name) {
	window.name = 'T' + (new Date()).getTime();
	cookies.set(stratumSessionCookie, window.name, cookieConf);
}
window.addEventListener('focus', () => {
	cookies.set(stratumSessionCookie, window.name, cookieConf);
});

// Check if SPA is active
if (routerContainer) {
	let lastUpdate = {};
	// Initiate Google Analytics for SPA if CLIENT_GA_PROPERTY is found
	if (CLIENT_GA_PROPERTY) {
		ReactGA.initialize(CLIENT_GA_PROPERTY);
	}

	render(
		<Provider store={store}>
			<Router history={history} routes={routes} onUpdate={function () {
				const { action, pathname } = this.state.location;
				if (!CLIENT_GA_PROPERTY) {
					return;
				}
				// Quick fix for not logging multiple views when redirecting pages.
				// TODO: Better solution when using REPLACE action.
				if (action !== 'REPLACE' || pathname !== lastUpdate.pathname) {
					ReactGA.set({ page: window.location.pathname });
					ReactGA.pageview(window.location.pathname);
				}
				lastUpdate = { action, pathname };
			}}/>
		</Provider>,
		routerContainer
	);
} else {
	if (mainContainer) {
		render(
			<Provider store={store}>
				<Application />
			</Provider>,
			mainContainer
		);
	}
	if (messageContainer) {
		render(
			<Provider store={store}>
				<Messages />
			</Provider>,
			messageContainer
		);
	}
	if (keystoneWidgets) {
		// Read widget id from data-attribute
		Array.prototype.forEach.call(keystoneWidgets, kw => {
			const widgetId = kw.getAttribute('data-keystone-widget');
			const description = kw.getAttribute('data-widget-description');
			render(
				<WidgetWrapper id={widgetId} description={description} />,
				kw
			);
		});
	}
}
