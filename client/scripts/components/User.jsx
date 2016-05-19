import React, { Component, PropTypes } from 'react';
 
class User extends Component {
	render(){
		const {context,wrongRegister,onClick} = this.props;
		const { User, Unit, Role } = context;
		const lastNameLetter = User.LastName[0];
		return (
			<a className="login-user-display" href="#" onClick={onClick}>
				<p className="username">{User.FirstName} {User.LastName}</p>
				<p className="unitname">{wrongRegister ? 'Byt enhet' : `${Unit.UnitName} (${Role.RoleName})`}</p>
			</a>
		);
		
	}
}

User.propTypes = {};

export default User;
