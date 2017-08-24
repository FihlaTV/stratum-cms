import React, { PropTypes } from 'react';
import Spinner from './Spinner';
import User from './User';
// import { Link } from 'react-router';

const RegistrationLink = ({ children, reactRouter, disabled, ...props }) => {
	const className = 'nav-button-text registration-link';
	if (disabled) {
		return <a className={className} disabled {...props}>{children}</a>;
	}
	// if (reactRouter) {
	// 	return <Link to="/registrering" className={className} {...props}>{children}</Link>;
	// }
	return <a href="/registrering" className={className} {...props}>{children}</a>;
};

const TopNav = ({
	loading,
	context,
	wrongRegister,
	showContextModal,
	setContextTarget,
	onUserHover,
	shrinkUnitName,
	showLoginModal,
	reactRouter,
	currentRouteIsRegistration,
}) => {
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
				<li style={visibility} className={currentRouteIsRegistration}>
					<RegistrationLink disabled={wrongRegister} reactRouter={reactRouter}>
						<p className="nav-button-text-big">Registrering</p>
						<p className="nav-button-text-small">med mera</p>
					</RegistrationLink>
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

TopNav.propTypes = {
	reactRouter: PropTypes.bool,
};

export default TopNav;
