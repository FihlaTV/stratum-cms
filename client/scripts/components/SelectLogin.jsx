import React, { Component, PropTypes } from 'react';

export default class SelectLogin extends Component {
	changeLogin (e) {
		this.props.onClick(this.props.loginMethod);
	}
	render () {
		return (
			<div className="col-sm-6">
				<a href="#" onClick={(e) => this.changeLogin(e)}>
					<div className={`login-method login-method-${this.props.logoClass}`}>
						<div className="login-method-logo"/>
						{this.props.children}
					</div>
				</a>
			</div>
		);
	}
}
