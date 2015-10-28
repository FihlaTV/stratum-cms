var React = require('react'),
	loginNav = document.getElementById('login-nav'),
	Application = require('./components/Application');

if(loginNav){
	React.render(
		<Application/>,
		loginNav		
	);
}
