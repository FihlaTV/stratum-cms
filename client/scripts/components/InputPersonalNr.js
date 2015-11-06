import React, { Component, PropTypes } from 'react';

export default class InputPersonalNr extends Component {
	render(){
		return (
			<form className="form-inline" onSubmit={(e) => this.changeLogin(e)}>
				<div className="form-group">
					<label htmlFor="bankIDPersonalNr">Personnummer: </label>
					<input type="text" className="form-control" placeholder="19xxxxxx-xxxx" id="bankIDPersonalNr" ref="input" />
				</div>
				<button className="btn btn-primary" type="submit">Next</button>
			</form>
		);
	}
	changeLogin(e){
		e.preventDefault();
		const node = this.refs.input;
		const text = node.value.trim();
		this.props.onSubmit(text);
	}
}

InputPersonalNr.propTypes = {
	onSubmit: PropTypes.func.isRequired
};
