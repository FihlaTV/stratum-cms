import React from 'react';
import App from './containers/RouterApp';
import News from './containers/News';
import NewsItem from './containers/NewsItem';
import ErrorPage from './components/ErrorPage';
import FAQ from './containers/FAQ';
import { Route, IndexRoute } from 'react-router';
import Page from './containers/Page';
import Index from './containers/Index';


export default (
	<Route path="/react" component={App}>
		<IndexRoute component={Index} />
		<Route path="nyheter" component={News} >
			<Route path=":nyhet" component={NewsItem} />
		</Route>
		<Route path="faq" component={FAQ} />
		<Route path=":menu" component={Page}>
			<Route path=":page(/:subpage)/p/:pageId" component={Page} />
		</Route>
		<Route path="*" component={ErrorPage} />
	</Route>
);
