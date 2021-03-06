import React from 'react';
import App from './containers/RouterApp';
import News from './containers/News';
import NewsItem from './containers/NewsItem';
import ErrorPage from './components/ErrorPage';
import FAQ from './containers/FAQ';
import { Route, IndexRoute } from 'react-router';
import Page from './containers/Page';
import Index from './containers/Index';
import Registration from './containers/Registration';
import ContactPage from './containers/ContactPage';
import SearchPage from './containers/SearchPage';
const { CLIENT_GOOGLE_API_KEY, CLIENT_GOOGLE_SEARCH_CX } = process.env;

export default (
	<Route path="/" component={App}>
		<IndexRoute component={Index} />
		<Route path="nyheter" component={News}>
			<Route path=":nyhet" component={NewsItem} />
		</Route>
		<Route path="faq" component={FAQ} />
		<Route path="404" component={ErrorPage} />
		<Route path="registrering" component={Registration} />
		<Route path="kontakt" component={ContactPage} />
		{CLIENT_GOOGLE_API_KEY &&
			CLIENT_GOOGLE_SEARCH_CX && (
				<Route path="sok(/:query)" component={SearchPage} />
			)}
		<Route path=":menu" component={Page}>
			<Route path=":page(/:subpage)/p/:pageId" component={Page} />
		</Route>
		<Route path="*" component={ErrorPage} />
	</Route>
);
