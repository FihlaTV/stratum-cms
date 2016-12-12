import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { clearError } from '../actions/error';

class ErrorPage extends Component {
	constructor (props) {
		super(props);
	}
	componentWillUnmount () {
		this.props.clearError();
	}
	render () {
		const message = this.props.error.message === 'null' ? '' : this.props.message;
		return (
			<div className="container error-page">
				<h1>Kunde inte hitta sidan du letade efter</h1>
				<p className="error-page-message">{message}</p>
				<p className="back-link"><Link to="/react/">Gå tillbaka till startsidan</Link></p>
			</div>
		);
	}
}

const mapStateToProps = ({ error }) => {
	return { error };
};

const mapDispatchToProps = (dispatch) => {
	return {
		clearError: () => dispatch(clearError()),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(ErrorPage);

// <Button bsStyle="primary" onClick={() => props.router.replace('/react/nyheter/1')}> Redirect </Button>
