import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setLoginMethod, inputPersonalNumber, resetState, LoginMethod, toggleNextState } from '../actions/actions';
// import ChangeLogin from '../components/ChangeLogin';
import SelectLogin from '../components/SelectLogin';
import InputPersonalNr from '../components/InputPersonalNr';
import ResetState from '../components/ResetState';
import NextButton from '../components/NextButton';
import LoginSelectorList from '../components/LoginSelectorList';
import SITHSLogin from '../components/SITHSLogin';
import BankID from './BankID';

class App extends Component {
	render() {
		const { 
			dispatch, 
			loginMethod, 
			personalNumber, 
			resetState, 
			loginSelect, 
			validPNr,
			nextState,
			hasNextState,
			sithsStatus
		} = this.props;
		switch(loginMethod){
			case LoginMethod.NOT_SELECTED:
				return (
					<div>
						<h1>Logga In <small>välj metod</small></h1>
						<LoginSelectorList onClick={loginSelect} loginSelectors={[
                            {cssClass: 'bankid', 
								loginMethod: LoginMethod.BANK_ID, title: 'Mobilt BankID'},
                            {cssClass: 'siths', loginMethod: LoginMethod.SITHS_CARD, title: 'SITHS-kort'}
						]}/>
					</div>
				);
			case LoginMethod.BANK_ID:
				return (
					<div>
						<BankID onSubmit={nextState}/>
						<ResetState onClick={resetState} />
						<NextButton onClick={nextState} isLoading={validPNr && !hasNextState} disabled={!(validPNr && hasNextState)}/>
					</div>
				);
			case LoginMethod.SITHS_CARD:
				return (
					<div>
						<SITHSLogin status={sithsStatus} />
						<ResetState onClick={resetState} />
						<NextButton onClick={nextState} isLoading={!hasNextState} disabled={!hasNextState}/>
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
		},
		nextState: () => {
			dispatch(toggleNextState());
		}
	};
}
function mapStateToProps(state){
	return {
		loginMethod: state.login.loginMethod,
		personalNumber: state.login.personalNumber,
		validPNr: state.bankId.personalNumberValidity,
		sithsStatus: state.login.sithsStatus,
		hasNextState: state.login.hasNextState
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
