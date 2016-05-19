import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { initLoginModal, showLoginModal, getKeystoneContext, logoutFromStratum } from '../actions/login';
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
			startContext,
			wrongRegister,
			initial,
			logout
		} = this.props;
		return (
			<div>
				<ul className="nav navbar-nav navbar-right">
					{startContext ? 
						<User ref={(c) => {
								if(initial || wrongRegister){ 
									showContextModal(ReactDOM.findDOMNode(c));
								}
							}} 
							context={startContext} 
							wrongRegister={wrongRegister} 
							onClick={(e) => showContextModal(e.target)}
						/>
						:
						<li>
							<a href="#" onClick={showLoginModal}>Logga In</a>
						</li>
					}
				</ul>
				<Login/>
				<Context 
					onLogout={logout} 
				/>
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
			dispatch(showContextModal(e));
		},
		logout: () => {
			dispatch(logoutFromStratum());
		}
	};
}
function mapStateToProps(state){
	return {
		startContext: state.login.context,
		context: state.context.stratumContext,
		initial: state.login.initial,
		wrongRegister: state.login.wrongRegister
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
