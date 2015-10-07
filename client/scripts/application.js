var React = require('react'),
	// NavItem = require('react-bootstrap').NavItem,
	// Modal = require('react-bootstrap').Modal,
	// Popover = require('react-bootstrap').Popover,
	// Tooltip = require('react-bootstrap').Tooltip,
	// Button = require('react-bootstrap').Button,
	// BIDLogin = require('./BIDLogin');
	LoginModal = require('./LoginModal');


// var App = React.createClass({
// 	render: function() {
// 		return (
// 			<h1>Hello World</h1>
// 		);
// 	}
// });


// function duder(eventKey){
// 	console.log('duder: ', eventKey);
// }
var loginNav = document.getElementById('login-nav');
if(loginNav){
	React.render(
		<LoginModal title="Login" />,
		loginNav		
	);
}
