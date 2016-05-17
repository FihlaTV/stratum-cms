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
			<p className="username">{user.FirstName} {user.LastName}</p>
			<p className="unitname">{unit.UnitName} ({role.RoleName})</p>
		</a>
	);
};

User.propTypes = {};

export default User;
