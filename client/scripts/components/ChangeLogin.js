import React, { Component, PropTypes } from 'react';

export default class ChangeLogin extends Component {
	render(){
		return (
			<div>
				<button className="btn btn-primary" onClick={(e) => this.changeLogin(e)} >Change Login Type</button>
			</div>
		);
	}
	changeLogin(e){
		this.props.onChangeClick('BANK_ID');
	}
}
