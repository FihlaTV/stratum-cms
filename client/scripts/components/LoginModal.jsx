import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap'; 

const LoginModal = ({
	children,
    title,
	show,
    titleSmall,
	...other
}) => {
	return (
		<Modal {...other} show={show}>
			<Modal.Header closeButton>
				<Modal.Title>{title} <small>{titleSmall}</small></Modal.Title> 
			</Modal.Header>
			{children}
		</Modal>
	);
}

LoginModal.Body = ({
    children
}) => {
    return (
        <Modal.Body>
            {children}
        </Modal.Body>
    );
}

LoginModal.Footer = ({
    children
}) => {
    return (
        <Modal.Footer>
            {children}
        </Modal.Footer>
    )
}

export default LoginModal;

