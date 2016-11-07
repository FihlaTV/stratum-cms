import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initPage } from '../actions/page';

class Page extends Component {
	componentDidMount () {
		const { dispatch, params } = this.props;
		const { pageId } = params;
		dispatch(initPage(pageId));
	}
	render () {
		const {
			params,
			page = {},
		} = this.props;
		const {
			title,
		} = page;
		return (
			<div>
				<h1>{title}</h1>
				<p>{params.pageId}</p>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		page: state.page,
	};
};

export default connect(mapStateToProps)(Page);
