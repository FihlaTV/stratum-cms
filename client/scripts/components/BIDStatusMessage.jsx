import React from 'react';

const StatusMessages = {
    NO_CLIENT: 'NO_CLIENT',
    OUTSTANDING_TRANSACTION: 'OUTSTANDING_TRANSACTION',
	USER_SIGN: 'USER_SIGN',
	COMPLETE: 'COMPLETE'
};

const BIDStatusMessage = ({
    status
}) => {
    switch (status) {
        case StatusMessages.NO_CLIENT:
        case StatusMessages.OUTSTANDING_TRANSACTION:
            return <span>Var god starta "Mobilt BankID"-appen i din smart phone</span>
		case StatusMessages.USER_SIGN:
			return <span>Skriv in din personliga kod i din smart phone</span>
		case StatusMessages.COMPLETE:
			return <span>Identifierad mot BankID, loggar in Stratum</span>
        default:
            return <span>{status}</span>
    }
}

export default BIDStatusMessage;