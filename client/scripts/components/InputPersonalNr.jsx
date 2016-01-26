import React, { Component, PropTypes } from 'react';

 
const InputPersonalNr = ({
		onSubmit,
		valid
	}) => {
	
	let input;
	
	return (
		<form className="form-inline" onSubmit={(e) => {
				e.preventDefault();
				return onSubmit(input.value);
			}}>
			<div className="form-group">
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
			<button className="btn btn-primary" type="submit">Next</button>
		</form>
	);
	
}

InputPersonalNr.propTypes = {
	onSubmit: PropTypes.func.isRequired
};

 export default InputPersonalNr;