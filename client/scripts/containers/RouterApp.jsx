import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link, IndexLink } from 'react-router';
import Menu from '../components/Menu';
import { Grid } from 'react-bootstrap';
import { fetchMenuItems } from '../actions/menu';

class App extends Component {
	componentDidMount () {
		const { dispatch } = this.props;
		dispatch(fetchMenuItems());
	}
	render () {
		const {
			children,
			location,
			menuItems,
		} = this.props;

		return (
			<div>
				<Menu items={menuItems} />
				<Grid>
					{children}
					<p>{location.pathname}</p>
				</Grid>
			</div>
		);
	}
}

function mapStateToProps (state, { location }) {
	return {
		location,
		menuItems: state.menu.items,
	};
}

export default connect(mapStateToProps)(App);
