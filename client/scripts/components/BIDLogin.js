var React = require('react'),
	Input = require('react-bootstrap').Input,
	Spinner = require('./Spinner'),
	moment = require('moment'),
	$ = require('jquery'),
	Modal = require('react-bootstrap').Modal,
	Alert = require('react-bootstrap').Alert,
	Button = require('react-bootstrap').Button,
	BIDState;

 
BIDState = {
	INIT: 0,
	LOADING: 1,
	LOAD_COMPLETE: 2
};

module.exports = React.createClass({
	getInitialState() {
		return {
			init: 'init',
			validity: 'error',
			repeats: this.props.repeats,
			bidSuccess: false,
			loadInProgress: false,
			bidState: BIDState.INIT,
			buttonText: 'Logga In'
		};
	},
	propTypes: {
		onLoadComplete: React.PropTypes.func,
		delay: React.PropTypes.number,
		repeats: React.PropTypes.number,
		initLoad: React.PropTypes.bool
	},
	getDefaultProps() {
		return {
			initLoad: false,
			delay: 2000,
			repeats: 10,
			orderUrl: process.env.CLIENT_STRATUM_SERVER + '/api/authenticate/bid/order/',
			collectUrl: process.env.CLIENT_STRATUM_SERVER + '/api/authenticate/bid/collect/'
		};
	},
	componentWillReceiveProps(nextProps) {
		// console.log('received props: ', nextProps);
		// if (nextProps.initLoad && !this.state.loadInProgress) {
		//  this.setState({
		//      loadInProgress: true,
		//      bidState: BIDState.LOADING
		//  });
		//  this.getToken();
		// }
	},
	componentWillMount() {
		console.log('componentWillMount');
	},
	initLogin() {
		console.log('initLogin');
	},
	loadComplete(success) {
		this.setState({
			bidState: BIDState.LOAD_COMPLETE,
			loadInProgress: false
		});
		this.props.onLoadComplete(success);
	},
	getToken() {
		$.ajax({
			url: this.props.orderUrl + this.state.personalNr,
			method: 'GET'
		}).done(function(data) {
			if (data && data.success) {
				this.setState({
					orderRef: data.data.orderRef
				});
				this.doLoad();
			} else {
				this.setState({
					bidState: BIDState.LOAD_COMPLETE,
					statusMsg: 'Kunde inte initiera inloggning med BankID'
				});
			}
		}.bind(this));
	},
	doLoad() {
		var repeats = this.state.repeats;
		if (repeats <= 0) {
			this.setState({
				statusMsg: 'Timeout',
				bidState: 'post'
			});
			this.loadComplete(false);
			return;
		}
		$.ajax({
			url: this.props.collectUrl + this.state.orderRef,
			method: 'GET',
			error: function(err) {
				this.setState({
					statusMsg: 'Error: ' + err,
					repeats: repeats - 1
				});
				setTimeout(function() {
					this.doLoad();
				}.bind(this), this.props.delay);
			}.bind(this),
			success: function(data) {
				var retState = {
					repeats: this.state.repeats - 1
				},
					continuePoll = false;
				if (!data.success) {
					console.log(data);
					return;
				}
				switch (data.data) {
				case 'OUTSTANDING_TRANSACTION': // 0
				case 'NO_CLIENT': // 1
					retState.statusMsg = 'Starta BankID säkerhetsapp i din mobila enhet.';
					continuePoll = true;
					break;
				case 'STARTED': // 2
				case 'USER_SIGN': // 3
					retState.statusMsg = 'Skriv in din säkerhetskod i BankID säkerhetsapp och välj Legitimera.';
					continuePoll = true;
					break;
				case 'COMPLETE': // 5
					// continuePoll = false;
					// getContext();
					retState.bidSuccess = true;
					retState.statusMsg = 'Klar!';
					break;
				case 'USER_CANCEL':
				case 'EXPIRED_TRANSACTION':
					retState.statusMsg = 'För lång tid hann passera';
					break;
				default: retState.statusMsg = 'Ett oväntat fel har inträffat ("' + data + '").';
					break;
				}
				if (continuePoll) {
					this.setState(retState);
					setTimeout(function() {
						this.doLoad();
					}.bind(this), this.props.delay);
				} else {
					this.setState(retState);
					this.loadComplete();
				}
				return;
			}.bind(this)
		});
	},
	personalNrChange(e) {
		this.setState({
			personalNr: e.target.value,
			validity: this.validatePersonalNr(e.target.value) ? 'success' : 'error'
		});
	},
	validatePersonalNr(pnr) {
		var matches = pnr
			.replace('-', '')
			.trim()
			.match(/^(\d\d){0,1}((\d{2})(\d{2})(\d{2})\d{4})$/);
		var century = matches && matches[1] || '19';
		if (!matches || !moment(century + matches.slice(3, 6).join('-')).isValid()) {
			return false;
		}
		return this.isValidSwedishPIN(matches[2]);
	},
	isValidSwedishPIN(pin) {
		pin = pin
			.replace(/\D/g, '') // strip out all but digits
			.split('') // convert string to array
			.reverse() // reverse order for Luhn
			.slice(0, 10); // keep only 10 digits (i.e. 1977 becomes 77)

		// verify we got 10 digits, otherwise it is invalid
		if (pin.length !== 10) {
			return false;
		}
		var sum = pin
			// convert to number
			.map(function(n) {
				return Number(n);
			})
			// perform arithmetic and return sum
			.reduce(function(previous, current, index) {
				// multiply every other number with two
				if (index % 2) {
					current *= 2;
				}
				// if larger than 10 get sum of individual digits (also n-9)
				if (current > 9) {
					current -= 9;
				}
				// sum it up
				return previous + current;
			});

		// sum must be divisible by 10
		return 0 === sum % 10;
	},
	onSubmit(e) {
		e.preventDefault();
		if (this.state.validity !== 'success') {
			this.setState({
				statusMsg: 'Var god slå in ditt presonnummer på rätt format...'
			});
		} else {
			// this.setState({
			//  initLoad: true,
			// });
			this.setState({
				disableButton: true,
				proceedText: 'Laddar...',
				loadInProgress: true,
				bidState: BIDState.LOADING
			});
			this.getToken();
		}
	},
	getAlert(){
		if(this.state.statusMsg){
			return (
				<Alert bsStyle="danger" dismissAfter={2000}>
					<h4>Fel</h4>
					<p>{this.state.statusMsg}</p>
				</Alert>
			);
		}
		return;
	},
	renderBody(){
		switch (this.state.bidState) {
		case BIDState.INIT :
			return (
				<div className="row">
					<div className="col-xs-9">
						<form onSubmit={this.onSubmit}>
							<Input type="text"
					onChange={this.personalNrChange}
					bsStyle={!this.state.personalNr || this.state.validity}
					hasFeedback={true}
					label="Perssonnummer: "
					placeholder="19xxxxxx-xxxx"
					help="Skriv in ditt personnummer och tryck sedan på Vidare för att sedan slå in din personliga kod i din mobiltelefon."
					/>
						</form>
					</div>
					<div className="col-xs-2 col-xs-offset-1">
						<img src="/images/bidlogo.png"/>
					</div>
					<div className="col-xs-12">
					{this.getAlert()}
					</div>
					</div>
			);
		case BIDState.LOADING :
			return (
				<div className="bankid-modal-loading">
					<h2>{this.state.statusMsg}</h2>
					<Spinner/>
					{/*
					<p className="bid-login-status">Laddar</p>
					*/}
				</div>
			);

		case BIDState.LOAD_COMPLETE :
			return (
				<div>
					<h1>{this.state.bidSuccess ? 'Inloggningen lyckades!' : 'Inloggningen misslyckades...'}</h1>
				</div>
			);
		}
	},
	render() {
		return (
			<div>
				<Modal.Body className="bankid-modal">
					{this.renderBody()}
				</Modal.Body>
				<Modal.Footer>
					<Button disabled={this.state.disableButton} bsStyle="primary" onClick={this.onSubmit}>{this.state.buttonText}</Button>
				</Modal.Footer>
			</div>
		);
	}
});

