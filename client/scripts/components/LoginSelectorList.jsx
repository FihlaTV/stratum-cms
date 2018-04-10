import React from 'react';
import SelectLogin from '../components/SelectLogin';

const LoginSelectorList = ({ onClick, loginSelectors }) => {
	return (
		<div className="login-method-list row">
			{loginSelectors.map(l => (
				<SelectLogin
					key={l.loginMethod}
					logoClass={l.cssClass}
					onClick={onClick}
					loginMethod={l.loginMethod}
				>
					{l.title}
				</SelectLogin>
			))}
		</div>
	);
};

export default LoginSelectorList;
