import React from 'react';
import App from './containers/RouterApp';
import { Route, IndexRoute } from 'react-router';

const About = ({}) => (
	<h1>About</h1>
);

const Index = () => (
	<h1>Registercentrum</h1>
);

export default (
	<Route path="/react/" component={App}>
		<IndexRoute component={Index} />
		<Route path="/react/about" component={About} />
	</Route>
);
