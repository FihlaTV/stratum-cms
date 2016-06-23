import React, { Component, PropTypes } from 'react';
 
class User extends Component {
	render(){
		const { 
			context,
			wrongRegister,
			onUserHover,
			shrinkName = true,
			onClick
		} = this.props;
		if(context){
			const { User, Unit, Role } = context;
			const unitName = Unit.UnitName.length > 20 && shrinkName ? Unit.UnitName.replace(/(.{0,17}).*/, '$1...') : Unit.UnitName;
			return (
				<a className="nav-button-text login-user-display" href="#" onMouseEnter={() => onUserHover(true)} onMouseLeave={() => onUserHover(false)} onClick={onClick}>
					<p className="nav-button-text-big username">{User.FirstName} {User.LastName}</p>
					<p className="nav-button-text-small unitname">{unitName} ({Role.RoleName})</p>
				</a>
			);
		} else {
				return (
					<a className="nav-button-text login-user-display" href="#" onClick={onClick}>
						<p className="nav-button-text-big username" style={{color: '#d00'}}>Fel register</p>
						<p className="nav-button-text-small unitname">Byt enhet</p>
					</a>
				);
		}
	
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
	}),
	onUserHover: PropTypes.func,
	shrinkName: PropTypes.bool
};

export default User;
