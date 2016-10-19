import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link, IndexLink } from 'react-router';
import Menu from '../components/Menu';
import { Grid } from 'react-bootstrap';

class App extends Component {
	render () {
		const {
			children,
			location,
		} = this.props;

		return (
			<div>
				<Menu />
				<Grid>
					{children}
					<p>{location.pathname}</p>
				</Grid>
			</div>
		);
	}
}

function mapDispatchToProps (dispatch) {
	return {};
}

function mapStateToProps (state, { location }) {
	return {
		location,
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
