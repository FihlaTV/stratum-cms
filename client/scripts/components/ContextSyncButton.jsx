import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';


const ContextSyncButton = (props) => {
	const {
		onClick,
		isSyncing,
		disabled,
		children,
		...other
	} = props;

	return (
		<Button bsStyle="primary" block onClick={onClick} disabled={disabled || isSyncing} {...other}>
			{isSyncing ? (<i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true" />) : children}
		</Button>
	);
};

ContextSyncButton.propTypes = {
	isSyncing: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
};

export default ContextSyncButton;
