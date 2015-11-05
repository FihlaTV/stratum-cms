import React, { Component, PropTypes } from 'react';

export default class SelectLogin extends Component {
	render(){
		return (
			<div>
				<button className="btn btn-lg btn-primary" onClick={(e) => this.changeLogin(e)} >{this.props.loginMethodName}</button>
			</div>
		);
	}
	changeLogin(e){
		this.props.selectLogin(this.props.loginMethod);
	}
}
