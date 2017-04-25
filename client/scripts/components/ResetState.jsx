import React, { PropTypes } from 'react';


const ResetState = ({
	onClick,
	disabled,
	children = 'Avbryt',
}) => {
	return (
		<button className="btn btn-primary" onClick={
			e => {
				e.preventDefault();
				onClick();
			}} disabled={disabled}>{children}</button>
	);
};

ResetState.propTypes = {
	onClick: PropTypes.func.isRequired,
};

export default ResetState;
