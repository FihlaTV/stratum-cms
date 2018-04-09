import React from 'react';
import PropTypes from 'prop-types';
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
				<option disabled value="" style={{ display: 'none' }} />
				{items.map((x) =>
					<option key={x.id} value={x.id}>{format(x)}</option>
				)}
			</FormControl>
			<HelpBlock>{helpText}</HelpBlock>
		</FormGroup>
	);
};

ContextSelect.propTypes = {
	format: PropTypes.func,
	items: PropTypes.array,
	roleChange: PropTypes.func,
	roles: PropTypes.array,
	unitChange: PropTypes.func,
};

export default ContextSelect;
