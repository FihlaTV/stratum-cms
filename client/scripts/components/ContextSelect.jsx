import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormControl, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';

const ContextSelect = ({
	current = '',
	helpText,
	label,
	onChange,
    items,
	format = (x) => `${x.name}`,
	...other
}) => {
	
	return (
		<FormGroup>
			<ControlLabel>{label}</ControlLabel>
			<FormControl
				componentClass="select" 
				value={current}
				onChange={(e) => {
					onChange(parseInt(e.target.value));
				}}
				{...other}
				>
				<option disabled value="" style={{display: 'none'}}></option>
				{items.map((x) => 
					<option key={x.id} value={x.id}>{format(x)}</option>
				)}
			</FormControl>
			<HelpBlock>{helpText}</HelpBlock>
		</FormGroup>
	);
};

ContextSelect.propTypes = {
	roleChange: PropTypes.func,
	unitChange: PropTypes.func,
	items: PropTypes.array,
	roles: PropTypes.array,
	format: PropTypes.func
};

export default ContextSelect;
