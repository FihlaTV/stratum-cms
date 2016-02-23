import React, { Component, PropTypes } from 'react';

const Modal = ({
	children,
    title,
    titleSmall
}) => {
	return (
        // <div className="modal fade" tabindex="-1" role="dialog">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h2 className="modal-title">{title} <small>{titleSmall}</small></h2> 
                    </div>
                    {children}
                </div>
            </div>
        // </div>
	);
}

Modal.Body = ({
    children
}) => {
    return (
        <div className="modal-body">
            {children}
        </div>
    );
}

Modal.Footer = ({
    children
}) => {
    return (
        <div className="modal-footer">
            {children}
        </div>
    )
}

export default Modal;

