var React = require('react'),
		Modal = require('react-bootstrap').Modal,
		NavItem = require('react-bootstrap').NavItem,
		Popover = require('react-bootstrap').Popover,
		Tooltip = require('react-bootstrap').Tooltip,
		Button = require('react-bootstrap').Button,
		BIDLogin = require('./BIDLogin'),
		LoginSelector = require('./LoginSelector.js'),
		LoginModal;

module.exports = LoginModal = React.createClass({

		getInitialState() {
				// return { showModal: false };
				return {
						showModal: true,
						proceedText: 'Vidare'
				};
		},

		close() {
				this.setState({
						showModal: false
				});
		},
		loadComplete(success) {
			console.log('load finnished' + (success ? ' without errors' : ' with errors...'));
			this.setState({
				initLoad: false,
				disableButton: false,
				proceedText: 'Klar'
			});
		},
		open() {
				this.setState({
						showModal: true
				});
		},
		initLogin() {
				this.setState({
					initLoad: true,
					disableButton: true,
					proceedText: 'Laddar...'
				});
		},
		render() {
			var btn = (<Button disabled={this.state.disableButton} bsStyle="primary" onClick={this.initLogin}>{this.state.proceedText}</Button>);
				// let popover = <Popover title="popover">very popover. such engagement</Popover>;
				// let tooltip = <Tooltip>wow.</Tooltip>;

				return (
					<NavItem eventKey={1} onSelect={this.open} href='/home'>
						Logga in i stratum

								<LoginSelector title={this.props.title} show={this.state.showModal} onHide={this.close}/>
								{/*<BIDLogin button={btn} initLoad={this.state.initLoad} onLoadComplete={this.loadComplete} bidState={this.state.bidState} onSubmit={this.initLogin}/>*/}
							{
							/*<Modal.Footer>
								<Button type="submit" onClick={this.close}>Avbryt</Button>
								{btn}
							</Modal.Footer>*/
							}
					</NavItem>
				);
		}
});
