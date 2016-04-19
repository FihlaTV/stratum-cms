import React from 'react';
import Alert from './Alert';

const StatusCodes = {
	NO_CLIENT: 'NO_CLIENT',
	OUTSTANDING_TRANSACTION: 'OUTSTANDING_TRANSACTION',
	USER_SIGN: 'USER_SIGN',
	COMPLETE: 'COMPLETE'
};

function getStatus(status){
	switch (status) {
		case StatusCodes.NO_CLIENT:
		case StatusCodes.OUTSTANDING_TRANSACTION:
			return {
				message: 'Starta appen för Mobilt BankID i din telefon.', 
				alert: 'warning',
				icon: 'fa-exclamation-triangle'
			};
		case StatusCodes.USER_SIGN:
			return {
				message: 'Skriv in din personliga kod i appen för Mobilt BankID.', 
				alert: 'info',
				icon: 'fa-info'
			};
		case StatusCodes.COMPLETE:
			return {
				message: 'Identifierad mot BankID, loggar in Stratum', 
				alert: 'success',
				icon: 'fa-check'
			};
		default:
			return {};
	}
}

const BIDStatusMessage = ({
    statusCode
}) => {
	const status = getStatus(statusCode);
	return (
		<Alert alertType={status.alert} faIcon={status.icon}>
			{status.message}
		</Alert>
	);
}

export default BIDStatusMessage;
