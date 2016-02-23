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
import Modal from '../components/Modal';
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
                <Modal title="Fel!">
					<Modal.Body>
                        <div className="alert alert-danger">
                            {error.message}
                        </div>
					</Modal.Body>
					<Modal.Footer>
                        <ResetState onClick={resetState} />
                    </Modal.Footer>
				</Modal>
			);
		}
		switch(loginMethod){
			case LoginMethod.NOT_SELECTED:
				return (
					<Modal title="Logga in" titleSmall="Välj metod">
                        <Modal.Body>
                            <LoginSelectorList onClick={loginSelect} loginSelectors={[
                                {cssClass: 'bankid', 
                                    loginMethod: LoginMethod.BANK_ID, title: 'Mobilt BankID'},
                                {cssClass: 'siths', loginMethod: LoginMethod.SITHS_CARD, title: 'SITHS-kort'}
                            ]}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <ResetState onClick={resetState} />
                        </Modal.Footer>
					</Modal>
				);
			case LoginMethod.BANK_ID:
				return (
					<Modal title="Mobilt BankID">
                        <Modal.Body>
                            <BankID onSubmit={nextState}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <ResetState onClick={resetState} />
                            <NextButton onClick={nextState} isLoading={validPNr && !hasNextState} disabled={!(validPNr && hasNextState)}/>
                        </Modal.Footer>
					</Modal>
				);
			case LoginMethod.SITHS_CARD:
				return (
					<Modal title="SITHS-kort">
                        <Modal.Body>
                            <SITHSLogin status={sithsStatus} />
                        </Modal.Body>
                        <Modal.Footer>
                            <ResetState onClick={resetState} />
                            <NextButton onClick={nextState} isLoading={!hasNextState} disabled={!hasNextState}/>
                        </Modal.Footer>
					</Modal>
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
