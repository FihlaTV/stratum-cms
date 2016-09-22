import React, { PropTypes } from 'react';

const NextButton = (props) => {
	const { children = 'Nästa', onClick, isLoading, loadingText = 'Laddar...', ...other } = props;

	return (
		<button {...other} className="btn btn-primary" onClick={
			e => {
				e.preventDefault();
				onClick();
			}}>{isLoading ? loadingText : children}</button>
	);
};

NextButton.propTypes = {
	onClick: PropTypes.func.isRequired,
};

 export default NextButton;
