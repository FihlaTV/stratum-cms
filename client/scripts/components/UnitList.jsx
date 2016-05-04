import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoginMethod, setLoginMethod } from '../actions/actions';
import { FormControl, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';

const UnitList = ({
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
					componentClass="select" >
					{roles.map((x) => 
						<option key={x.id} value={x.id}>{x.name}</option>
					)}
				</FormControl>
				<HelpBlock>Help text here....</HelpBlock>
				<ControlLabel>Välj enhet:</ControlLabel>
				<FormControl
					componentClass="select" >
					{units.map((x) => 
						<option key={x.id} value={x.id}>{x.name}</option>
					)}
				</FormControl>
				<HelpBlock>Help text here....</HelpBlock>
			</FormGroup>
		</form>
	);
};

export default UnitList;
