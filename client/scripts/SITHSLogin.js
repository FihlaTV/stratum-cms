var React = require('react');
var Button = require('react-bootstrap').Button;
var $ = require('jquery');

require('dotenv').load();

module.exports = React.createClass({
	getInitialState(){
		return {
			status: 'nan'
		};
	},
	login(){
		$.ajax({
			url: process.env.STRATUM_SERVER + '/api/authenticate/login',
			method: 'GET',
			xhrFields: {
				withCredentials: true
			}
		}).done(function(data) {
			if (data && data.success) {
				this.setState({
					status: JSON.stringify(data)
				});
				$.ajax({
					url: process.env.STRATUM_SERVER + '/api/authenticate/timeleft',
					method: 'GET',
					xhrFields: {
						withCredentials: true
					}
				}).done(function(data2){
					this.setState({
						status: data2
					});
					$.ajax({
						url: '/api/authenticate/context',
						method: 'GET',
						xhrFields: {
							withCredentials: true
						}
					}).done(function(data3){
						this.setState({
							status: data3
						});
					}.bind(this));
				}.bind(this));
			} else {
				this.setState({
					status: 'Kunde inte initiera inloggning med siths'
				});
			}
		}.bind(this));
	},
	render(){
		return (
			<div>
				<h1>SITHS</h1>
				<p>{this.state.status}</p>
				<Button onClick={this.login} bsStyle="primary">Login</Button>
			</div>
		);
	}
});
