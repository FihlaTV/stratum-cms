import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link, IndexLink } from 'react-router';
import Menu from '../components/Menu';
import { Grid } from 'react-bootstrap';
import { fetchMenuItems } from '../actions/menu';

class App extends Component {
	constructor (props) {
		super(props);
	}
	componentDidMount () {
		const { dispatch } = this.props;
		dispatch(fetchMenuItems());
	}
	componentWillReceiveProps (nextProps) {
		if (nextProps.error.status && this.props.location.pathname !== '/react/404') {
			this.props.router.push('/react/404');
		}
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
		error: state.error,
	};
}

export default connect(mapStateToProps)(App);
