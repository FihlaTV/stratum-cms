var React = require('react'),
	NavItem = require('react-bootstrap').NavItem,
	Button = require('react-bootstrap').Button;

var App = React.createClass({
	render: function() {
		return (
			<h1>Hello World</h1>
		);
	}
});

function duder(eventKey){
	console.log('duder: ', eventKey);
}

React.render(
	// <App/>,
	// <Button bsStyle="success" bsSize="small" >
	// 	Login
	// </Button>,
	<NavItem eventKey={1} onSelect={duder} href='/home'>
		Logga in i stratum
	</NavItem>,
	document.getElementById('login-nav')
);
