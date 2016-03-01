import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setLoginMethod, inputPersonalNumber, resetState, LoginMethod, toggleNextState, showLoginModal } from '../actions/actions';
import Login from './Login.jsx';

class App extends Component {
	render() {
		const { 
			showLoginModal
		} = this.props;
		return (
			<div>
				<ul className="nav navbar-nav navbar-right">
					<li>
						<a href="#" onClick={showLoginModal}>Logga In</a>
					</li>
				</ul>
				<Login/>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch){
	return {
		showLoginModal: () => {
			dispatch(showLoginModal(true));
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
