import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setLoginMethod, resetState,
	LoginMethod, toggleNextState, showLoginModal,
	updateSithsNewCard } from '../actions/login';
// import ChangeLogin from '../components/ChangeLogin';
import ResetState from '../components/ResetState';
import NextButton from '../components/NextButton';
import LoginSelectorList from '../components/LoginSelectorList';
import SITHSLogin from '../components/SITHSLogin';
import LoginModal from '../components/LoginModal';
import Alert from '../components/Alert';
import BankID from './BankID';

class Login extends Component {
	render () {
		const {
			error,
			close,
			loginMethod,
			resetState,
			loginSelect,
			validPNr,
			nextState,
			hasNextState,
			sithsStatus,
			showModal,
			https,
			sithsNewCardChange,
			validNewCard,
		} = this.props;
		if (error) {
			return (
				<LoginModal onHide={close} show={showModal} title="Inloggningen Misslyckades">
					<LoginModal.Body>
						<Alert alertType="danger" faIcon="fa-exclamation-triangle">
							{error.message}
						</Alert>
					</LoginModal.Body>
					<LoginModal.Footer>
						<ResetState onClick={close}>Stäng</ResetState>
					</LoginModal.Footer>
				</LoginModal>
			);
		}
		switch (loginMethod) {
			case LoginMethod.NOT_SELECTED:
				return (
					<LoginModal onHide={close} show={showModal} title="Välj metod för att logga in">
						<LoginModal.Body>
							<LoginSelectorList onClick={loginSelect} loginSelectors={[
								{ cssClass: 'siths', loginMethod: LoginMethod.SITHS_CARD, title: 'SITHS-kort' },
								{ cssClass: 'bankid',
									loginMethod: LoginMethod.BANK_ID, title: 'Mobilt BankID' },
							]}/>
							{!https
							&& <Alert alertType="danger" faIcon="fa-exclamation-triangle">
								Du är inte under https, inloggningen kommer inte fungera som förväntat
							</Alert>
							}
						</LoginModal.Body>
						<LoginModal.Footer>
							<ResetState onClick={close} />
						</LoginModal.Footer>
					</LoginModal>
				);
			case LoginMethod.BANK_ID:
				return (
					<LoginModal onHide={close} show={showModal} title="Mobilt BankID">
						<LoginModal.Body>
							<BankID onSubmit={nextState}/>
						</LoginModal.Body>
						<LoginModal.Footer>
							<ResetState onClick={resetState} disabled={validPNr && !hasNextState}>Tillbaka</ResetState>
							<NextButton onClick={nextState} isLoading={validPNr && !hasNextState} disabled={!(validPNr && hasNextState)}/>
						</LoginModal.Footer>
					</LoginModal>
				);
			case LoginMethod.SITHS_CARD:
				return (
					<LoginModal onHide={close} show={showModal} title="SITHS-kort">
						<LoginModal.Body>
							<SITHSLogin status={sithsStatus}
								onNewCardSubmit={nextState}
								validNewCard={validNewCard}
								onNewCardChange={sithsNewCardChange}
							/>
						</LoginModal.Body>
						<LoginModal.Footer>
							<ResetState onClick={resetState} disabled={!hasNextState}>Tillbaka</ResetState>
							<NextButton onClick={nextState} isLoading={!hasNextState} disabled={!hasNextState || sithsStatus === 'SITHS_NEW_CARD' && !validNewCard}/>
						</LoginModal.Footer>
					</LoginModal>
				);
		}
	}
}

Login.propTypes = {
	loginMethod: PropTypes.oneOf([
		'BANK_ID',
		'SITHS_CARD',
		'NOT_SELECTED',
	]),
};

function mapDispatchToProps (dispatch) {
	return {
		resetState: () => {
			dispatch(resetState());
		},
		loginSelect: (method) => {
			dispatch(setLoginMethod(method));
		},
		nextState: () => {
			dispatch(toggleNextState());
		},
		close: () => {
			dispatch(showLoginModal(false));
		},
		sithsNewCardChange: ({ username, password }) => {
			dispatch(updateSithsNewCard(username, password));
		},
	};
}
function mapStateToProps (state) {
	return {
		error: state.login.error,
		loginMethod: state.login.loginMethod,
		personalNumber: state.login.personalNumber,
		validPNr: state.bankId.personalNumberValidity,
		sithsStatus: state.login.sithsStatus,
		hasNextState: state.login.hasNextState,
		showModal: state.login.showLoginModal,
		https: state.login.https,
		validNewCard: state.login.sithsNewCard.valid,
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
