import React, { Component, PropTypes } from 'react';
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
		const { menuItems, pageId, children } = this.props;
		const menu = this.findPage(pageId, menuItems);

		if (menu) {
			return <Link to={`/react${menu.url}`}>{children || menu.label}</Link>;
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
