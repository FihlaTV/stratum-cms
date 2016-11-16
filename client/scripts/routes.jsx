import React from 'react';
import App from './containers/RouterApp';
import { Route, IndexRoute } from 'react-router';
import Page from './containers/Page';

const News = ({ children }) => (
	<div>
		<h1>Nyheter</h1>
		{children}
	</div>
);

const FAQ = () => (
	<h1>FAQ</h1>
);

const Index = () => (
	<h1>Registercentrum</h1>
);

export default (
	<Route path="/react/" component={App}>
		<IndexRoute component={Index} />
		<Route path="nyheter" component={News}>
			<Route path="more" component={() => <h1>More About</h1>} />
		</Route>
		<Route path="faq" component={FAQ} />
		<Route path=":menu" >
			<Route path=":page**/p/:pageId" component={Page} />
		</Route>
	</Route>
);
