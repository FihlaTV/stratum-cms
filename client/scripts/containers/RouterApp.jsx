import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';

class App extends Component {
	render () {
		const {
			children,
			location,
		} = this.props;
		console.log(location);
		return (
			<div>
				<p>{location.pathname}</p>
				<IndexLink to="/react/" activeClassName="active" className="btn btn-primary">Registercentrum</IndexLink>
				<Link to="/react/about" activeClassName="active" className="btn btn-primary">About</Link>
				<div>
					{children}
				</div>
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
