import React from 'react';
import App from './containers/RouterApp';
import News from './containers/News';
import NewsItem from './containers/NewsItem';
import ErrorPage from './components/ErrorPage';
import FAQ from './containers/FAQ';
import { Route, IndexRoute } from 'react-router';
import Page from './containers/Page';

const Index = () => (
	<h1>Registercentrum</h1>
);

export default (
	<Route path="/react/" component={App}>
		<IndexRoute component={Index} />
		<Route path="nyheter" component={News} >
			<Route path=":nyhet" component={NewsItem} />
		</Route>
		<Route path="faq" component={FAQ} />
		<Route path="*" component={ErrorPage} />
		<Route path=":menu" component={Page}>
			<Route path=":page**/p/:pageId" component={Page} />
		</Route>
	</Route>
);
