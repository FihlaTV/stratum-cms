import React, { Component } from 'react';
import {
	Button,
	FormGroup,
	FormControl,
	ControlLabel,
	Alert,
} from 'react-bootstrap';

const successParam = 'newsletter_success=1';

export default class PsykRegNewsletter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			name: '',
			location: `${window.location.origin}${
				window.location.pathname
			}?${successParam}`,
			success: !!window.location.href.match(
				new RegExp(`(?:\\?|&)${successParam}(?:&|$)`)
			),
		};
	}
	isEmailValid() {
		const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return emailRegEx.test(this.state.email);
	}
	getValidationState() {
		return this.state.email === ''
			? null
			: this.isEmailValid() ? 'success' : 'error';
	}
	render() {
		return this.state.success ? (
			<Alert bsStyle="success">
				<strong>Tack för din prenumeration.</strong>
			</Alert>
		) : (
			<form
				name="fpren"
				action="https://newsletter.paloma.se//register/"
				method="get"
				style={{
					marginBottom: 20,
				}}
			>
				<input type="hidden" name="distlistkey" value="66488" />
				<input type="hidden" name="gora" value="pren" />
				<input
					type="hidden"
					name="tacksida"
					value={this.state.location}
				/>
				<FormGroup>
					<ControlLabel>Namn</ControlLabel>
					<FormControl
						type="text"
						name="namn"
						value={this.state.name}
						placeholder="Förnamn Efternamn"
						onChange={e => this.setState({ name: e.target.value })}
					/>
				</FormGroup>
				<FormGroup validationState={this.getValidationState()}>
					<ControlLabel>E-post</ControlLabel>
					<FormControl
						type="text"
						name="email"
						value={this.state.email}
						placeholder="E-post"
						onChange={e => this.setState({ email: e.target.value })}
					/>
					<FormControl.Feedback />
				</FormGroup>
				<input
					type="text"
					name="donotfill"
					autoComplete="new-password"
					tabIndex="-1"
					style={{ display: 'none' }}
				/>
				<Button
					type="submit"
					bsStyle="primary"
					disabled={!this.isEmailValid() || !this.state.name}
				>
					Skicka
				</Button>
			</form>
		);
	}
}

PsykRegNewsletter.defaultProps = {};
