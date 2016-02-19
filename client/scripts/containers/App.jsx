import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setLoginMethod, inputPersonalNumber, resetState, LoginMethod } from '../actions/actions';
// import ChangeLogin from '../components/ChangeLogin';
import SelectLogin from '../components/SelectLogin';
import InputPersonalNr from '../components/InputPersonalNr';
import ResetState from '../components/ResetState';
import LoginSelectorList from '../components/LoginSelectorList';
import SITHSLogin from '../components/SITHSLogin';
import BankID from './BankID';

class App extends Component {
	render() {
		const { dispatch, loginMethod, personalNumber, resetState, loginSelect } = this.props;
		switch(loginMethod){
			case LoginMethod.NOT_SELECTED:
				return (
					<div>
						<h1>Logga In <small>välj metod</small></h1>
						<LoginSelectorList onClick={loginSelect} loginSelectors={[
                            {cssClass: 'bankid', loginMethod: LoginMethod.BANK_ID, title: 'Mobilt BankID'},
                            {cssClass: 'siths', loginMethod: LoginMethod.SITHS_CARD, title: 'SITHS-kort'}
                            ]}/>
					</div>
				);
			case LoginMethod.BANK_ID:
				return (
					<div>
						<BankID/>
						<ResetState onClick={resetState} />
					</div>
				);
			case LoginMethod.SITHS_CARD:
				return (
					<div>
						<SITHSLogin/>
						<ResetState onClick={resetState} />
					</div>
				);
			default :
				return (<div>Unknown state error</div>);
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
	return {
		resetState: () => {
			dispatch(resetState());
		},
		loginSelect: (method) => {
			dispatch(setLoginMethod(method));
		}
	};
}
function mapStateToProps(state){
	return {
		loginMethod: state.login.loginMethod,
		personalNumber: state.login.personalNumber
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
