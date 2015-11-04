import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setLoginMethod, inputPersonalNumber, LoginMethods } from '../actions/actions';

class App extends Component {
	render() {
		const { dispatch, loginMethod } = this.props;
		return (
			<div>
				<h1>Login</h1>
				<strong>Login Method: </strong>{loginMethod}
			</div>
		);
	}
}

App.propTypes = {
  loginMethod: PropTypes.oneOf([
    'BANK_ID',
    'SITHS_CARD'
  ]).isRequired
};

function mapStateToProps(state){
	return {
		loginMethod: state.login.loginMethod
	};
}

export default connect(mapStateToProps)(App);
