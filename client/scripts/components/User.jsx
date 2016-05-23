import React, { Component, PropTypes } from 'react';
 
class User extends Component {
	render(){
		const {context,wrongRegister,onClick} = this.props;
		const { User, Unit, Role } = context;
		return (
			<a className="login-user-display" href="#" onClick={onClick}>
				<p className="username">{User.FirstName} {User.LastName}</p>
				<p className="unitname">{wrongRegister ? 'Byt enhet' : `${Unit.UnitName} (${Role.RoleName})`}</p>
			</a>
		);
	}
}

User.propTypes = {
	wrongRegister: PropTypes.bool,
	onClick: PropTypes.func,
	context: PropTypes.shape({
		Unit: PropTypes.shape({
			UnitName: PropTypes.string.isRequired	
		}).isRequired,
		Role: PropTypes.shape({
			RoleName: PropTypes.string.isRequired
		}).isRequired,
		User: PropTypes.shape({
			FirstName: PropTypes.string.isRequired,
			LastName: PropTypes.string.isRequired
		}).isRequired
	}).isRequired,
};

export default User;
