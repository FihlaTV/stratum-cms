import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setLoginMethod, initLoginModal, inputPersonalNumber, resetState, LoginMethod, toggleNextState, showLoginModal } from '../actions/actions';
import { showContextModal } from '../actions/context';
import Login from './Login.jsx';
import Context from './Context.jsx';

class App extends Component {
	render() {
		const { 
			showLoginModal,
			showContextModal
		} = this.props;
		return (
			<div>
				<ul className="nav navbar-nav navbar-right">
					<li>
						<a href="#" onClick={showLoginModal}>Logga In</a>
					</li>
					<li>
						<a href="#" onClick={showContextModal}>Byt enhet</a>
					</li>
				</ul>
				<Login/>
				<Context/>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch){
	return {
		showLoginModal: () => {
			dispatch(initLoginModal(true));
		},
		showContextModal: (e) => {
			dispatch(showContextModal(e.target));
		}
	};
}
function mapStateToProps(state){
	return {
		// error: state.login.error,
		// loginMethod: state.login.loginMethod,
		// personalNumber: state.login.personalNumber,
		// validPNr: state.bankId.personalNumberValidity,
		// sithsStatus: state.login.sithsStatus,
		// hasNextState: state.login.hasNextState,
		// showModal: state.login.showLoginModal
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
