import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ContextSelect from './ContextSelect';

const UnitList = ({
	currentRole,
	currentUnit,
	context,
	roleChange,
	unitChange,
    units,
	roles
}) => {
	const contextId = context ? context.ContextID : 'N/A';
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
		</form>
	);
};

UnitList.propTypes = {
	context: PropTypes.shape({
		ContextID: PropTypes.number
	}),
	roleChange: PropTypes.func,
	unitChange: PropTypes.func,
	units: PropTypes.array,
	roles: PropTypes.array
};

export default UnitList;
