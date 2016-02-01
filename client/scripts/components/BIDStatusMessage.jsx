import React from 'react';

const StatusMessages = {
    NO_CLIENT: 'NO_CLIENT',
    OUTSTANDING_CLIENT: 'OUTSTANDING_CLIENT'
};

const BIDStatusMessage = ({
    status
}) => {
    switch (status) {
        case StatusMessages.NO_CLIENT:
            return <span>Hej svej no client</span>
        case StatusMessages.OUTSTANDING_CLIENT:
            return <span>Var god do something plsz...</span>
        default:
            return <span>Saknar status...</span>
    }
}

export default BIDStatusMessage;