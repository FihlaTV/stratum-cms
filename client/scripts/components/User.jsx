import React, { Component, PropTypes } from 'react';

class User extends Component {
	render () {
		const {
			context,
			onUserHover,
			shrinkName,
			onClick,
			unitMaxLength = 20,
		} = this.props;
		if (context) {
			const { User, Unit, Role } = context;
			const unitRegEx = new RegExp(`(.{0,${unitMaxLength - 3}}).*`);
			const unitName = Unit.UnitName.length > unitMaxLength && shrinkName ? Unit.UnitName.replace(unitRegEx, '$1...') : Unit.UnitName;
			return (
				<a className="nav-button-text login-user-display" href="#" onMouseEnter={() => onUserHover(true)} onMouseLeave={() => onUserHover(false)} onClick={onClick}>
					<p className="nav-button-text-big username">{User.FirstName} {User.LastName}</p>
					<p className="nav-button-text-small unitname">{unitName} ({Role.RoleName})</p>
				</a>
			);
		} else {
			return (
				<a className="nav-button-text login-user-display login-user-display-wrong" href="#" onClick={onClick}>
					Välj nedan
				</a>
			);
		}

	}
}

User.propTypes = {
	context: PropTypes.shape({
		Unit: PropTypes.shape({
			UnitName: PropTypes.string.isRequired,
		}).isRequired,
		Role: PropTypes.shape({
			RoleName: PropTypes.string.isRequired,
		}).isRequired,
		User: PropTypes.shape({
			FirstName: PropTypes.string.isRequired,
			LastName: PropTypes.string.isRequired,
		}).isRequired,
	}),
	onClick: PropTypes.func,
	onUserHover: PropTypes.func,
	shrinkName: PropTypes.bool,
	unitMaxLength: PropTypes.number,
};

export default User;
