import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { initLoginModal, showLoginModal, getKeystoneContext, logoutFromStratum, changeContext } from '../actions/login';
import { showContextModal, syncContext, setTarget } from '../actions/context';
import Login from './Login.jsx';
import Context from './Context.jsx';
import User from '../components/User.jsx';
import Spinner from '../components/Spinner';

class App extends Component {
	componentDidMount() {
		const { initContext } = this.props;
		// See if there is any current login
		initContext(true);
	}
	componentWillReceiveProps(nextProps){
		const { context, initial } = this.props;
		const { showContextModal, wrongRegister } = nextProps;
		if(context && nextProps.context !== context){
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
			contextTarget,
			contextIsLoading,
			contexts,
			logout
		} = this.props;
		return (
			<div>
				<ul className="nav navbar-nav navbar-right">
					{contextIsLoading ? 
						<Spinner small style={{margin: 14}}/> :
						(context ? 
							<User ref={setContextTarget}
								context={context} 
								wrongRegister={wrongRegister} 
								onClick={(e) => showContextModal(true)}
							/>
							:
							<li>
								<a href="#" onClick={showLoginModal}>Logga in</a>
							</li>
						)
					}
				</ul>
				<Login/>
				<Context 
					contexts={contexts}
					requireChange={wrongRegister}
					target={contextTarget}
					inUnit={context && context.Unit.UnitID}
					inRole={context && context.Role.RoleID}
					roleChange={x => console.log(x)}
					firstTime={initial}
					onLogout={logout} 
					onSubmit={setContext}
					onCancel={() => showContextModal(false)}
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
		},
		setContext: (context) => {
			dispatch(changeContext(context));
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
		contextTarget: state.context.target
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
