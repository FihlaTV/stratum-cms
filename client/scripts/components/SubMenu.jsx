import React, { PropTypes } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

/**
 * Returns the current active page on top level
 * When @activePageId points to a sub page
 */
function findActivePage (activePageId, menuItems = []) {
	return menuItems.find((item) => {
		if (item.pageKey !== activePageId) {
			return findActivePage(activePageId, item.items);
		}
		return item.pageKey === activePageId;
	});
}

function renderLink (activeTopPage = {}) {
	return (menuItem) => {
		const { key, url, label, items = [], pageKey } = menuItem;
		const cls = [];
		const displaySubNav = pageKey === activeTopPage.pageKey && items.length > 0;

		if (items.length > 0) {
			cls.push('has-sub-pages');
		}
		if (displaySubNav) {
			cls.push('expanded');
		}
		const Link = (
			<LinkContainer key={key} to={`/react${url}`} activeClassName="active" className={cls.join(' ')}>
				<NavItem>
					{label}
				</NavItem>
			</LinkContainer>
		);

		return displaySubNav ? [Link, <SubNav containsSubPages key={`sub-nav-${key}`} menuItems={items}/>] : Link;
	};
}

const SubNav = ({
	menuItems = [],
	containsSubPages = false,
	activeTopPage,
}) => {
	const cls = containsSubPages ? 'nav-page-second' : 'nav-page';
	return (
		<Nav bsStyle="pills" className={cls} stacked>
			{menuItems.map(renderLink(activeTopPage))}
		</Nav>
	);
};

const SubMenu = ({
	menuBlock = {},
	activePageId,
}) => {
	const { items = [] } = menuBlock;
	const activeTopPage = findActivePage(activePageId, items);
	return (
		<div className="sub-menu">
			<SubNav menuItems={items} activeTopPage={activeTopPage}/>
		</div>
	);

};

SubMenu.propTypes = {
	activePageId: PropTypes.string,
	menuBlock: PropTypes.object,
 };

export default SubMenu;
