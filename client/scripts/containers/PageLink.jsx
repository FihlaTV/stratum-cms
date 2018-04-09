import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class PageLink extends Component {
	findPage (pageId, menuItems) {
		if (!pageId) {
			return null;
		}
		return menuItems.reduce((prev, menu) => {
			if (prev) {
				return prev;
			}
			if (menu.pageKey === pageId) {
				return menu;
			} else if (menu.items) {
				return this.findPage(pageId, menu.items);
			}
			return prev;
		}, null);
	}
	render () {
		const { menuItems, pageId, children, ...rest } = this.props;
		const menu = this.findPage(pageId, menuItems);

		if (menu) {
			return <Link to={`${menu.url}`} {...rest}>{children || menu.label}</Link>;
		}
		return null;
	}
}

const mapStateToProps = ({ menu }) => {
	return {
		menuItems: menu.items,
	};
};

export default connect(mapStateToProps)(PageLink);

PageLink.propTypes = {
	pageId: PropTypes.string,
};
