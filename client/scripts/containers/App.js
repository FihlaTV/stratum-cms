import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setLoginMethod, inputPersonalNumber, resetState, LoginMethods } from '../actions/actions';
// import ChangeLogin from '../components/ChangeLogin';
import SelectLogin from '../components/SelectLogin';
import InputPersonalNr from '../components/InputPersonalNr';

class App extends Component {
	render() {
		const { dispatch, loginMethod, personalNumber } = this.props;
		return (
			<div>
				<h1>Login <small>{loginMethod} {personalNumber}</small></h1>
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
				{loginMethod === LoginMethods.BANK_ID &&
					<div>
						<h1>Bank ID</h1>
						<InputPersonalNr onSubmit={x => dispatch(inputPersonalNumber(x))}/>
					</div>
				}
				{loginMethod &&
				<button className="btn" onClick={x => dispatch(resetState())}>Reset state</button>
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

// function cycleLoginMethod(current){
// 	let keys = Object.keys(LoginMethods);
// 	let newKey = keys[(keys.findIndex(x => x.localeCompare(current) === 0) + 1) % keys.length];
// 	return LoginMethods[newKey];
// }

function mapStateToProps(state){
	return {
		loginMethod: state.login.loginMethod,
		personalNumber: state.login.personalNumber
	};
}

export default connect(mapStateToProps)(App);
