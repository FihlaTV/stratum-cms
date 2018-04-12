import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({ children, alertType, faIcon }) => {
	let iconCls = `fa ${faIcon} pull-right`;
	return (
		<div className={`alert alert-${alertType}`} role="alert">
			{faIcon ? <i className={iconCls} /> : ''}
			{children}
		</div>
	);
};

Alert.propTypes = {
	alertType: PropTypes.oneOf(['warning', 'danger', 'success', 'info']),
};

export default Alert;
