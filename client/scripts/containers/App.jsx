import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {
	initLoginModal,
	getKeystoneContext,
	logoutFromStratum,
	changeContext,
	dismissTimeleft,
	setShrinkUnitName,
} from '../actions/login';
import { showContextModal, setTarget } from '../actions/context';
import Login from './Login.jsx';
import Context from './Context.jsx';
import TimeLeftDialog from '../components/TimeLeftDialog';
import TopNav from '../components/TopNav';

class App extends Component {
	componentDidMount() {
		const { initContext } = this.props;
		// See if there is any current login
		initContext(true);
	}
	componentWillReceiveProps(nextProps) {
		const { context, initial } = this.props;
		const { showContextModal, wrongRegister } = nextProps;
		if (nextProps.context && nextProps.context !== context) {
			showContextModal && showContextModal(false);
		}
		if ((!initial && nextProps.initial) || wrongRegister) {
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
			shrinkUnitName,
			contextIsLoading,
			setShrinkUnitName,
			contexts,
			logout,
			contextIsVisible,
			reactRouter,
			currentRoute,
			enableSearch,
		} = this.props;
		var currentRouteIsRegistration =
			currentRoute === '/registrering' ? 'active' : '';
		const modifiedShowTimeLeft =
			showTimeleft ||
			(window.location.href.indexOf('loggedout') > 0 && !(timeleft > 0));
		return (
			<div>
				<TopNav
					loading={contextIsLoading}
					context={context}
					wrongRegister={wrongRegister}
					showContextModal={showContextModal}
					showLoginModal={showLoginModal}
					onUserHover={hover => setShrinkUnitName(!hover)}
					shrinkUnitName={shrinkUnitName && !contextIsVisible}
					setContextTarget={setContextTarget}
					reactRouter={reactRouter}
					currentRouteIsRegistration={currentRouteIsRegistration}
					enableSearch={enableSearch}
				/>
				<TimeLeftDialog
					show={modifiedShowTimeLeft}
					timeleft={timeleft}
					onDismiss={onTimeleftDismiss}
				/>
				<Login />
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
					}}
					onCancel={() => showContextModal(false)}
					onFirstAccept={() => window.location.reload()}
				/>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		initContext: initial => {
			dispatch(getKeystoneContext(initial));
		},
		showLoginModal: () => {
			dispatch(initLoginModal(true));
		},
		showContextModal: e => {
			dispatch(showContextModal(e));
		},
		logout: () => {
			dispatch(logoutFromStratum());
		},
		setContext: (role, unit, contexts) => {
			dispatch(changeContext(role, unit, contexts));
		},
		onTimeleftDismiss: timeleft => {
			dispatch(dismissTimeleft(timeleft));
		},
		setShrinkUnitName: shrink => {
			dispatch(setShrinkUnitName(shrink));
		},
		setContextTarget: target => {
			dispatch(setTarget(ReactDOM.findDOMNode(target)));
		},
	};
}
function mapStateToProps(state) {
	return {
		context: state.login.context,
		contextIsLoading: state.login.contextIsLoading,
		initial: state.login.initial,
		contexts: state.login.contexts,
		wrongRegister: state.login.wrongRegister,
		timeleft: state.login.timeleft,
		showTimeleft: state.login.showTimeleft,
		shrinkUnitName: state.login.shrinkUnitName,
		contextTarget: state.context.target,
		contextIsVisible: state.context.show,
		currentRoute: state.routing.locationBeforeTransitions.pathname,
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
