import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ContextSelect from './ContextSelect';

const UnitList = ({
	currentRole,
	currentUnit,
	contextId = 'N/A',
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
				helpText={'ContextID: ' + contextId}
				disabled={units.length <= 0}
				format={x => `${x.name} (${x.code}) (${x.id})`}
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
