import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoginMethod, setLoginMethod } from '../actions/actions';
import SelectLogin from '../components/SelectLogin';

const LoginSelectorList = ({
	onClick,
    loginSelectors
}) => {
	return (
		<div className="login-method-list row">
            {loginSelectors.map(l => 
                <SelectLogin logoClass={l.cssClass} onClick={onClick} loginMethod={l.loginMethod}>
                    {l.title}
                </SelectLogin>
            )}
		</div>
	);
}

const mapStateToProps = (state) => {
	return {};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onClick: (method) => {
			dispatch(setLoginMethod(method));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginSelectorList);
