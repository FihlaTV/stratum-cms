import React, { Component, PropTypes } from 'react';
 
const User = ({
	user,
	unit,
	role,
	onClick
}) => {
	const lastNameLetter = user.LastName[0];
	return (
		<a className="login-user-display" href="#" onClick={onClick}>
			<span className="username">{user.FirstName} ({role.RoleName})</span>
			<span className="unitname">{unit.UnitName}</span>
		</a>
	);
};

User.propTypes = {};

export default User;
