import React, { Component, PropTypes } from 'react';
import Spinner from './Spinner';
import User from './User';

const TopNav = ({
	loading,
	context,
	wrongRegister,
	showContextModal,
	setContextTarget,
	onUserHover,
	shrinkUnitName,
	showLoginModal,
}) => {
	const isRegistration = location.pathname === '/registrering' ? 'active' : '';
	const spinnerStyle = {
		display: loading ? 'block' : 'none',
		margin: 14,
		position: 'absolute',
		right: '10px',
	};
	const visibility = loading ? { visibility: 'hidden' } : {};
	if (loading || context || wrongRegister) {
		return (
			<ul className="nav navbar-nav navbar-right">
				<Spinner small style={spinnerStyle}/>
				<li style={visibility} className={isRegistration}>
					<a href="/registrering" className="nav-button-text registration-link" disabled={wrongRegister} onClick={(e) => {
						if (wrongRegister) {
							e.preventDefault();
						}
					}}>
						<p className="nav-button-text-big">Registrering</p>
						<p className="nav-button-text-small">med mera</p>
					</a>
				</li>
				<li style={visibility}>
					<User ref={setContextTarget}
						context={context}
						wrongRegister={wrongRegister}
						onUserHover={onUserHover}
						shrinkName={shrinkUnitName}
						onClick={(e) => {
							e.preventDefault();
							showContextModal(true);
						}}
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
