import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setBreadcrumbs, clearBreadcrumbs } from '../actions/breadcrumbs';
import { findFirstPageInMenu } from '../utils/menu';

const menuId = 'kontakt';

class Contact extends Component {
	componentDidMount() {
		const { menu = {} } = this.props;
		this.redirectToRegularPage(menu.items);
	}
	componentWillReceiveProps({ menu: nextMenu }) {
		const { menu } = this.props;
		if (nextMenu.items.length >= 1 && menu.items.length === 0) {
			this.redirectToRegularPage(nextMenu.items);
		}
	}
	componentWillUnmount() {
		this.props.clearBreadcrumbs();
	}
	redirectToRegularPage(menuItems) {
		const { router } = this.props;
		const firstPage = findFirstPageInMenu(menuId, menuItems);
		if (firstPage) {
			router.replace(firstPage.url);
		} else {
			this.setBreadcrumbs(menuItems);
		}
	}
	setBreadcrumbs(menuItems) {
		const menuItem = menuItems.find(menuItem => menuItem.key === menuId);
		const label = (menuItem && menuItem.label) || 'Kontakt';

		this.props.setBreadcrumbs([{ url: menuId, label }], true, label);
	}
	render() {
		const { title } = this.props;
		return (
			<Row>
				<Col md={8}>
					<div className="base-page">
						<h1>{title}</h1>
					</div>
				</Col>
			</Row>
		);
	}
}

const mapStateToProps = ({ faq, menu }) => {
	return {
		// 	loading: faq.loading,
		menu,
	};
};
const mapDispatchToProps = dispatch => ({
	setBreadcrumbs: (...args) => dispatch(setBreadcrumbs(...args)),
	clearBreadcrumbs: () => dispatch(clearBreadcrumbs()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Contact);

Contact.defaultProps = {
	title: 'Kontakt',
};

Contact.propTypes = {};
