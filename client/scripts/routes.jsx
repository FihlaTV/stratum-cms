import React from 'react';
import App from './containers/RouterApp';
import { Route, IndexRoute } from 'react-router';

const About = ({ children }) => (
	<div>
		<h1>About</h1>
		{children}
	</div>
);

const Contact = () => (
	<h1>Contact</h1>
);

const Index = () => (
	<h1>Registercentrum</h1>
);

export default (
	<Route path="/react/" component={App}>
		<IndexRoute component={Index} />
		<Route path="about" component={About}>
			<Route path="more" component={() => <h1>More About</h1>} />
		</Route>
		<Route path="contact" component={Contact} />
	</Route>
);
