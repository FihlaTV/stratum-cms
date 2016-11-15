import React from 'react';
import App from './containers/RouterApp';
import RenderChildren from './components/RenderChildren';
import News from './containers/News';
import NewsItem from './containers/NewsItem';
import { Route, IndexRoute } from 'react-router';
import Page from './containers/Page';


const FAQ = () => (
	<h1>FAQ</h1>
);

const Index = () => (
	<h1>Registercentrum</h1>
);

export default (
	<Route path="/react/" component={App}>
		<IndexRoute component={Index} />
		<Route path="nyheter" component={RenderChildren} >
			<IndexRoute component={News} />
			<Route path=":nyhet" component={NewsItem} />
		</Route>
		<Route path="faq" component={FAQ} />
		<Route path="**/p/:pageId" component={Page} />
	</Route>
);
