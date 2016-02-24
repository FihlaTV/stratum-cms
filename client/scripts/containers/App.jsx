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
import LoginModal from '../components/LoginModal';
import BankID from './BankID';

class App extends Component {
	render() {
		const { 
			dispatch,
			error, 
			loginMethod, 
			personalNumber, 
			resetState, 
			loginSelect, 
			validPNr,
			nextState,
			hasNextState,
			sithsStatus
		} = this.props;
		if(error){
			return (
                <LoginModal show={true} title="Inloggningen Misslyckades">
					<LoginModal.Body>
                        <div className="alert alert-danger">
							<i className="fa fa-exclamation-triangle pull-right"></i>
                            {error.message}
                        </div>
					</LoginModal.Body>
					<LoginModal.Footer>
                        <ResetState onClick={resetState} />
                    </LoginModal.Footer>
				</LoginModal>
			);
		}
		switch(loginMethod){
			case LoginMethod.NOT_SELECTED:
				return (
					<LoginModal show={true} title="Logga in" titleSmall="Välj metod">
                        <LoginModal.Body>
                            <LoginSelectorList onClick={loginSelect} loginSelectors={[
                                {cssClass: 'bankid', 
                                    loginMethod: LoginMethod.BANK_ID, title: 'Mobilt BankID'},
                                {cssClass: 'siths', loginMethod: LoginMethod.SITHS_CARD, title: 'SITHS-kort'}
                            ]}/>
                        </LoginModal.Body>
                        <LoginModal.Footer>
                            <ResetState onClick={resetState} />
                        </LoginModal.Footer>
					</LoginModal>
				);
			case LoginMethod.BANK_ID:
				return (
					<LoginModal show={true} title="Mobilt BankID">
                        <LoginModal.Body>
                            <BankID onSubmit={nextState}/>
                        </LoginModal.Body>
                        <LoginModal.Footer>
                            <ResetState onClick={resetState} />
                            <NextButton onClick={nextState} isLoading={validPNr && !hasNextState} disabled={!(validPNr && hasNextState)}/>
                        </LoginModal.Footer>
					</LoginModal>
				);
			case LoginMethod.SITHS_CARD:
				return (
					<LoginModal show={true} title="SITHS-kort">
                        <LoginModal.Body>
                            <SITHSLogin status={sithsStatus} />
                        </LoginModal.Body>
                        <LoginModal.Footer>
                            <ResetState onClick={resetState} />
                            <NextButton onClick={nextState} isLoading={!hasNextState} disabled={!hasNextState}/>
                        </LoginModal.Footer>
					</LoginModal>
				);
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
		error: state.login.error,
		loginMethod: state.login.loginMethod,
		personalNumber: state.login.personalNumber,
		validPNr: state.bankId.personalNumberValidity,
		sithsStatus: state.login.sithsStatus,
		hasNextState: state.login.hasNextState
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
