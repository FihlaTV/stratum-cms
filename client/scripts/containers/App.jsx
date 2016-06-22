import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { initLoginModal, showLoginModal, getKeystoneContext, logoutFromStratum, changeContext, dismissTimeleft } from '../actions/login';
import { showContextModal, setTarget } from '../actions/context';
import Login from './Login.jsx';
import Context from './Context.jsx';
import User from '../components/User.jsx';
import Spinner from '../components/Spinner';
import TimeLeftDialog from '../components/TimeLeftDialog';
import TopNav from '../components/TopNav';

class App extends Component {
	componentDidMount() {
		const { initContext } = this.props;
		// See if there is any current login
		initContext(true);
	}
	componentWillReceiveProps(nextProps){
		const { context, initial } = this.props;
		const { showContextModal, wrongRegister } = nextProps;
		if(nextProps.context && nextProps.context !== context){
			showContextModal && showContextModal(false);
		}
		if(!initial && nextProps.initial || wrongRegister){
			showContextModal && showContextModal(true);
		}
	}
	render() {
		const { 
			showLoginModal,
			showContextModal,
			context,
			wrongRegister,
			setContext,
			setContextTarget,
			initial,
			timeleft,
			onTimeleftDismiss,
			showTimeleft,
			contextTarget,
			contextIsLoading,
			contexts,
			logout
		} = this.props;
		return (
			<div>
				<TopNav 
					loading={contextIsLoading}
					context={context}
					wrongRegister={wrongRegister}
					showContextModal={showContextModal}
					showLoginModal={showLoginModal}
					setContextTarget={setContextTarget}
				/>
				<TimeLeftDialog show={showTimeleft} timeleft={timeleft} onDismiss={onTimeleftDismiss}/>
				<Login/>
				<Context 
					contexts={contexts}
					requireChange={wrongRegister}
					target={contextTarget}
					inUnit={context && context.Unit.UnitID}
					inRole={context && context.Role.RoleID}
					firstTime={initial}
					onLogout={logout} 
					onSubmit={(role, unit) => {
						setContext(role, unit, contexts);
					}
					}
					onCancel={() => showContextModal(false)}
				/>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch){
	return {
		initContext: (initial) => {
			dispatch(getKeystoneContext(initial));
		},
		showLoginModal: () => {
			dispatch(initLoginModal(true));
		},
		showContextModal: (e) => {
			dispatch(showContextModal(e));
		},
		logout: () => {
			dispatch(logoutFromStratum());
		},
		setContext: (role, unit, contexts) => {
			dispatch(changeContext(role, unit, contexts));
		},
		onTimeleftDismiss: (timeleft) => {
			dispatch(dismissTimeleft(timeleft));
		},
		setContextTarget: (target) => {
			dispatch(setTarget(ReactDOM.findDOMNode(target)));
		}
	};
}
function mapStateToProps(state){
	return {
		context: state.login.context,
		contextIsLoading: state.login.contextIsLoading,
		initial: state.login.initial,
		contexts: state.login.contexts,
		wrongRegister: state.login.wrongRegister,
		timeleft: state.login.timeleft,
		showTimeleft: state.login.showTimeleft,
		contextTarget: state.context.target
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
