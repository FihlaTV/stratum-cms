import React, { PropTypes } from 'react';
import ContextSelect from './ContextSelect';
import { FormControl, ControlLabel, FormGroup } from 'react-bootstrap';

const UnitList = ({
	currentRole,
	currentUnit,
	context,
	roleChange,
	unitChange,
    units,
	roles,
	register,
}) => {
	return (
		<form>
			<ContextSelect
				current={currentRole}
				onChange={roleChange}
				items={roles}
				label="Välj roll:"
			/>
			<ContextSelect
				current={currentUnit}
				onChange={unitChange}
				items={units}
				label="Välj enhet:"
				disabled={units.length <= 0}
				format={x => `${x.name} (${x.code})`}
			/>
			<FormGroup>
				<ControlLabel>Register: </ControlLabel>
				<FormControl rows="2" style={{ resize: 'none', overflow: 'hidden' }} componentClass="textarea" value={register} disabled/>
			</FormGroup>
		</form>
	);
};

UnitList.propTypes = {
	context: PropTypes.shape({
		ContextID: PropTypes.number,
	}),
	roleChange: PropTypes.func,
	roles: PropTypes.array,
	unitChange: PropTypes.func,
	units: PropTypes.array,
};

export default UnitList;
