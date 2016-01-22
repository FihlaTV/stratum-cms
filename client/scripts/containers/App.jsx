import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setLoginMethod, inputPersonalNumber, resetState, LoginMethod } from '../actions/actions';
// import ChangeLogin from '../components/ChangeLogin';
import SelectLogin from '../components/SelectLogin.jsx';
import InputPersonalNr from '../components/InputPersonalNr.jsx';
import LoginSelectorList from './LoginSelectorList.jsx';
import BankID from './BankID.jsx';

class App extends Component {
	render() {
		const { dispatch, loginMethod, personalNumber } = this.props;
		switch(loginMethod){
			case LoginMethod.NOT_SELECTED:
				return (
					<div>
					<h1>Login <small>{loginMethod} {personalNumber}</small></h1>
						<LoginSelectorList />
					</div>
				);
			case LoginMethod.BANK_ID:
				return (
					<div>
						<BankID/>
					</div>
				);
			case LoginMethod.SITHS_CARD:
				return (
					<div>
						<h1>SITHS</h1>
					</div>
				);
			default :
				return (<div></div>);
		}
	}
}

App.propTypes = {
  loginMethod: PropTypes.oneOf([
    'BANK_ID',
    'SITHS_CARD',
	'NOT_SELECTED'
  ])
};

function mapDispatchToProps(dispatch){
	
}
function mapStateToProps(state){
	return {
		loginMethod: state.login.loginMethod,
		personalNumber: state.login.personalNumber
	};
}

export default connect(mapStateToProps)(App);
