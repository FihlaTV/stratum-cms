import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setLoginMethod, inputPersonalNumber, LoginMethods } from '../actions/actions';
import ChangeLogin from '../components/ChangeLogin';
import SelectLogin from '../components/SelectLogin';

class App extends Component {
	render() {
		const { dispatch, loginMethod } = this.props;
		return (
			<div>
				<h1>Login <small>{loginMethod}</small></h1>
				{!loginMethod && 
					<div className="login-method-list row">
						<div className="col-sm-6">
							<SelectLogin selectLogin={loginMethod => 
								dispatch(setLoginMethod(loginMethod))} loginMethod={LoginMethods.SITHS_CARD} loginMethodName="SITHS-Kort"/>
						</div>
						<div className="col-sm-6">
							<SelectLogin selectLogin={loginMethod => 
								dispatch(setLoginMethod(loginMethod))} loginMethod={LoginMethods.BANK_ID} loginMethodName="Mobilt BankID"/>
						</div>
					</div>
				}
				{loginMethod &&
				<button className="btn" onClick={x => dispatch(setLoginMethod())}>Reset state</button>
				}
			</div>
		);
	}
}

App.propTypes = {
  loginMethod: PropTypes.oneOf([
    'BANK_ID',
    'SITHS_CARD'
  ])
};

// function initLogin(loginMethodName){
// 	console.log(loginMethodName);

// }

function cycleLoginMethod(current){
	let keys = Object.keys(LoginMethods);
	let newKey = keys[(keys.findIndex(x => x.localeCompare(current) === 0) + 1) % keys.length];
	return LoginMethods[newKey];
}

function mapStateToProps(state){
	return {
		loginMethod: state.login.loginMethod
	};
}

export default connect(mapStateToProps)(App);
