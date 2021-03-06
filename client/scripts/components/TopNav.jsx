import React from 'react';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import User from './User';
import { Link } from 'react-router';

const RegistrationLink = ({ children, reactRouter, disabled, ...props }) => {
	const className = 'nav-button-text registration-link';
	if (disabled) {
		return (
			<a className={className} disabled {...props}>
				{children}
			</a>
		);
	}
	// if (reactRouter) {
	// 	return <Link to="/registrering" className={className} {...props}>{children}</Link>;
	// }
	return (
		<a href="/registrering" className={className} {...props}>
			{children}
		</a>
	);
};

const NavParent = ({ children }) => (
	<ul className="nav navbar-nav navbar-right">{children}</ul>
);

const SearchButton = ({}) => (
	<li>
		<Link
			// href="#"
			to="/sok"
			className="search-button"
		>
			<i className="fa fa-icon fa-search" />
		</Link>
	</li>
);

const LoginButton = ({ onClick, label, externalLink }) => (
	<li>
		<a
			href={externalLink || '#'}
			target={externalLink ? '_blank' : null}
			onClick={onClick}
		>
			{label}
		</a>
	</li>
);

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
	loginButtonLabel = 'Logga in',
	externalLogin,
	enableSearch,
	searchOnly,
}) => {
	const spinnerStyle = {
		display: loading ? 'block' : 'none',
		margin: 14,
		position: 'absolute',
		right: '10px',
	};
	const visibility = loading ? { visibility: 'hidden' } : {};
	if (searchOnly) {
		return (
			<NavParent>
				<SearchButton />
			</NavParent>
		);
	}
	if (externalLogin) {
		return (
			<NavParent>
				{enableSearch && <SearchButton />}
				<LoginButton
					label={loginButtonLabel}
					externalLink={externalLogin}
				/>
			</NavParent>
		);
	}
	if (loading || context || wrongRegister) {
		return (
			<NavParent>
				{enableSearch && <SearchButton />}
				<Spinner small style={spinnerStyle} />
				<li style={visibility} className={currentRouteIsRegistration}>
					<RegistrationLink
						disabled={wrongRegister}
						reactRouter={reactRouter}
					>
						<p className="nav-button-text-big">Registrering</p>
						<p className="nav-button-text-small">med mera</p>
					</RegistrationLink>
				</li>
				<li style={visibility}>
					<User
						ref={setContextTarget}
						context={context}
						wrongRegister={wrongRegister}
						onUserHover={onUserHover}
						shrinkName={shrinkUnitName}
						onClick={e => {
							e.preventDefault();
							showContextModal(true);
						}}
					/>
				</li>
			</NavParent>
		);
	}
	return (
		<NavParent>
			{enableSearch && <SearchButton />}
			<LoginButton label={loginButtonLabel} onClick={showLoginModal} />
		</NavParent>
	);
};

TopNav.propTypes = {
	externalLogin: PropTypes.string,
	reactRouter: PropTypes.bool,
};

export default TopNav;
