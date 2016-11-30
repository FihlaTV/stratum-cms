import React from 'react';
import App from './containers/RouterApp';
import { Route, IndexRoute } from 'react-router';
import Page from './containers/Page';
import Index from './containers/Index';
import FAQ from './containers/FAQ';

const News = ({ children }) => (
	<div>
		<h1>Nyheter</h1>
		{children}
	</div>
);

export default (
	<Route path="/react/" component={App}>
		<IndexRoute component={Index} />
		<Route path="nyheter" component={News}>
			<Route path="more" component={() => <h1>More About</h1>} />
		</Route>
		<Route path="faq" component={FAQ} />
		<Route path=":menu" component={Page}>
			<Route path=":page(/:subpage)/p/:pageId" component={Page} />
		</Route>
	</Route>
);
