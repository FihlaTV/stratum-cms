import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoginMethod, setLoginMethod } from '../actions/actions';
import { FormControl, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';

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
			<FormGroup
				controlId="formBasicText"
			>
				<ControlLabel>Välj roll:</ControlLabel>
				<FormControl
					componentClass="select" 
					value={currentRole}
					onChange={(e) => {
						roleChange(parseInt(e.target.value));
					}}
					>
					<option disabled value=""></option>
					{roles.map((x) => 
						<option key={x.id} value={x.id}>{x.name}</option>
					)}
				</FormControl>
				<HelpBlock>Help text here....</HelpBlock>
				<ControlLabel>Välj enhet:</ControlLabel>
				<FormControl
					disabled={units.length <= 0}
					componentClass="select" 
					value={currentUnit}
					onChange={(e) => {
						unitChange(parseInt(e.target.value));
					}}>
					<option disabled value=""></option>
					{units.map((x) => 
						<option key={x.id} value={x.id}>{x.name}</option>
					)}
				</FormControl>
				<HelpBlock>Help text here....</HelpBlock>
			</FormGroup>
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
