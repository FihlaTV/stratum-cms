import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { initPage } from '../actions/page';

class Page extends Component {
	componentDidMount () {
		const { dispatch } = this.props;
		// dispatch(initPage());
	}
	render () {
		const {
		} = this.props;

		return (
			<h1>Page</h1>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		page: state.page,
	};
};

export default connect(mapStateToProps)(Page);
