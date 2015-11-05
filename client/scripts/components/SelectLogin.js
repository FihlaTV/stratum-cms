import React, { Component, PropTypes } from 'react';

export default class SelectLogin extends Component {
	render(){
		return (
			<a href="#" onClick={(e) => this.changeLogin(e)}>
				<div className={'login-method login-method-siths'}>
					<div className="login-method-logo"/>
					{this.props.loginMethodName}
				</div>
			</a>
		);
	}
	changeLogin(e){
		this.props.selectLogin(this.props.loginMethod);
	}
}
