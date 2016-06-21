import React, { Component, PropTypes } from 'react';
import Spinner from './Spinner';
import User from './User';

const TopNav = ({
	loading,
	context,
	wrongRegister,
	showContextModal,
	setContextTarget,
	showLoginModal
}) => {
	const isRegistration = wrongRegister || location.pathname === '/registrering' ? 'active' : '';
	if(loading){
		return (
			<ul className="nav navbar-nav navbar-right">
				<Spinner small style={{margin: 14}}/>
			</ul>
		);
	}
	if(context || wrongRegister){
		return (
			<ul className="nav navbar-nav navbar-right">
				<li className={isRegistration}>
					<a className="registration-link" disabled={wrongRegister} onClick={(e) => {
						e.preventDefault();
						if(!wrongRegister){
							location.replace('/registrering');
						}
												
					}}>Registrera</a>
				</li>
				<li>
					<User ref={setContextTarget}
						context={context} 
						wrongRegister={wrongRegister} 
						onClick={(e) => showContextModal(true)}
					/>
				</li>
			</ul>
		);
	}
	return (
		<ul className="nav navbar-nav navbar-right">
			<li>
				<a href="#" onClick={showLoginModal}>Logga in</a>
			</li>
		</ul>
	);
};

export default TopNav;
