import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setLoginMethod, initLoginModal, inputPersonalNumber, 
	resetState, LoginMethod, toggleNextState, showLoginModal,
	getKeystoneContext } from '../actions/actions';
import { showContextModal } from '../actions/context';
import Login from './Login.jsx';
import Context from './Context.jsx';
import User from '../components/User.jsx';

class App extends Component {
	componentDidMount() {
		const { initContext } = this.props;
		// See if there is any current login
		initContext();
	}
	render() {
		const { 
			showLoginModal,
			showContextModal,
			user,
			role,
			unit
		} = this.props;
		return (
			<div>
				<ul className="nav navbar-nav navbar-right">
					{user && role && unit ? 
						<User user={user} role={role} unit={unit} onClick={showContextModal}/>
						:
						<li>
							<a href="#" onClick={showLoginModal}>Logga In</a>
						</li>
					}
				</ul>
				<Login/>
				<Context/>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch){
	return {
		initContext: () => {
			dispatch(getKeystoneContext());
		},
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
		user: state.login.user,
		role: state.login.role,
		unit: state.login.unit
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
