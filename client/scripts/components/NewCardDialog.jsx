import React, { Component, PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import ReactDOM from 'react-dom';

function FieldGroup({ id, label, help, refInput, style, inputStyle, ...props }) {
  return (
    <FormGroup controlId={id} style={style}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl ref={refInput} style={inputStyle} {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

const NewCardDialog = ({
        onChange,
		onSubmit,
		valid
	}) => {
	
	let username, password;
	
	return (
		<form 
			onSubmit={(e) => {
				e.preventDefault();
				var usernameVal = ReactDOM.findDOMNode(username).value;
				var passwordVal = ReactDOM.findDOMNode(password).value;
				return onSubmit(usernameVal, passwordVal);
			}}>
			<FieldGroup 
				label="Användarnamn:"
				autoComplete="off" 
				id="assignUsername"
				onChange={
					(e) => {
						const passwordVal = ReactDOM.findDOMNode(password).value;
						return onChange({username: e.target.value, password: passwordVal});
					}} 
				refInput={(node) => username = node}
				autoFocus
			/>
			<FieldGroup
				label="Engångslösenord:"
				type="password" 
				autoComplete="off" 
				id="assignPassword" 
				onChange={
					(e) => {
						const usernameVal = ReactDOM.findDOMNode(username).value;
						return onChange({username: usernameVal, password: e.target.value});
					}} 
				refInput={(node) => password = node}
			/>
			<FieldGroup
				type="submit"
				style={{
					display: 'none'
				}}
			/>
		</form>
	);
	
};

NewCardDialog.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func
};

 export default NewCardDialog;
