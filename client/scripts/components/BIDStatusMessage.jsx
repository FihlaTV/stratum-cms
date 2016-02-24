import React from 'react';

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
			return {message: 'Var god starta "Mobilt BankID"-appen i din smart phone', alert: 'warning'};
		case StatusCodes.USER_SIGN:
			return {message: 'Skriv in din personliga kod i din smart phone', alert: 'info'};
		case StatusCodes.COMPLETE:
			return {message: 'Identifierad mot BankID, loggar in Stratum', alert: 'success'};
		default:
			return {};
	}
}

const BIDStatusMessage = ({
    statusCode
}) => {
	const status = getStatus(statusCode);
	return (
		<div className={`alert alert-${status.alert}`}>
			{status.message}
		</div>
	);	
}


export default BIDStatusMessage;