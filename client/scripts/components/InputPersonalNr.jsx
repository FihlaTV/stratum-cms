import React, { Component, PropTypes } from 'react';

 
const InputPersonalNr = ({
        onBlur,
		onSubmit,
		valid
	}) => {
	
	let input;
    let classNames = ['form-group', valid ? 'has-success' : 'has-error'];
    
	
	return (
		<form className="form-inline" onChange={(e) => {
                return onBlur(input.value);
            }}
            onSubmit={(e) => {
				e.preventDefault();
				return onSubmit(input.value);
			}}>
			<div className={classNames.join(' ')}>
				<label htmlFor="bankIDPersonalNr">Personnummer: </label>
				<input 
					type="text" 
					className="form-control" 
					placeholder="19xxxxxx-xxxx" 
					id="bankIDPersonalNr" 
					ref={(node) => {
							input = node;
						}
					}
				/>
				{valid ? 'Valid' : ''}
			</div>
			<button className="btn btn-primary" type="submit" disabled={!valid}>Next</button>
		</form>
	);
	
}

InputPersonalNr.propTypes = {
	onSubmit: PropTypes.func.isRequired
};

 export default InputPersonalNr;