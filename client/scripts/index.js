var React = require('react'),
	loginNav = document.getElementById('login-nav'),
	Application = require('./Application');

if(loginNav){
	React.render(
		<Application/>,
		loginNav		
	);
}
