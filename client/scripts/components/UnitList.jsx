import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoginMethod, setLoginMethod } from '../actions/actions';
import ContextSelect from './ContextSelect';

const UnitList = ({
	currentRole,
	currentUnit,
	roleChange,
	unitChange,
    units,
	roles
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
				helpText="Help Text"
				disabled={units.length <= 0}
			/>
		</form>
	);
};

UnitList.propTypes = {
	roleChange: PropTypes.func,
	unitChange: PropTypes.func,
	units: PropTypes.array,
	roles: PropTypes.array
};

export default UnitList;
