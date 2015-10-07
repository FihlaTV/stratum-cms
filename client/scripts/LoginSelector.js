var React = require('react'),
	BIDLogin = require('./BIDLogin'),
	Modal = require('react-bootstrap').Modal,
	Button = require('react-bootstrap').Button,
	SITHSLogin = require('./SITHSLogin');


var LoginList = React.createClass({
	handleClick(id) {
		if (this.props.loginSelected) {
			this.props.loginSelected(id);
		}
	},
	render() {
		return (
			<div className="login-method-list row">
				{this.props.items.slice(0, 4).map(function(item, i, items) {
				var size = 12 / items.length;
				return (
					<div className={'col-sm-' + size} key={item.id}>
							<a href="#" onClick={this.handleClick.bind(this, item.id)}>
								<div className={'login-method login-method-' + item.id}>
									<div className={'login-method-logo'}/>
									{item.text}
								</div>
							</a>
						</div>
					);
			}.bind(this))}
			</div>
			);
	}
});

module.exports = React.createClass({
	loginSelected(loginId) {
		this.setState({
			loginId: loginId
		});
	},
	getInitialState() {
		return {
			items: [{
				text: 'Mobilt BankID',
				id: 'bankid'
			}, {
				text: 'SITHS-kort',
				id: 'siths'
			}, {
				text: 'Ny Användare',
				id: 'new-user'
			}]
		};
	},
	renderLogin() {
		switch (this.state.loginId) {
		case 'bankid':
			return (
				<BIDLogin isInModal/>
				);
		case 'siths':
			return (
				<Modal.Body>
					<SITHSLogin/>
				</Modal.Body>
				);
		case 'new-user':
			return (
				<Modal.Body>
						<div>
							<h1>Ny användare</h1>
							<p>Fyll i dina uppgifter för ett nytt användarkonto</p> 
						</div>
					</Modal.Body>
				);
		default: return (
			<div>
				<Modal.Body>
						<LoginList isInModal={true} loginSelected={this.loginSelected} items={this.state.items}/>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.props.onHide}>Avbryt</Button>
					</Modal.Footer>
					</div>
				);
		}
	},
	render() {
		return (
			<Modal show={this.props.show} onHide={this.props.onHide}>
				<Modal.Header closeButton>
					<Modal.Title>{this.props.title}</Modal.Title>
				</Modal.Header>
				{this.renderLogin()}
			</Modal>
		);
	}
});
