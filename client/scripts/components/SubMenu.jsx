import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

/**
 * Returns the current active page on top level
 * When @activePageId points to a sub page
 */
function findActivePage(activePageId, menuItems = []) {
	return menuItems.find(item => {
		if (item.pageKey !== activePageId) {
			return findActivePage(activePageId, item.items);
		}
		return item.pageKey === activePageId;
	});
}

function renderLink(activeTopPage = {}) {
	return menuItem => {
		const { key, url, label, items = [], pageKey, state } = menuItem;
		const cls = [];
		const displaySubNav =
			pageKey === activeTopPage.pageKey && items.length > 0;

		if (items.length > 0) {
			cls.push('has-sub-pages');
		}
		if (displaySubNav) {
			cls.push('expanded');
		}
		if (state === 'draft') {
			cls.push('nav-page-draft');
		}
		const Link = (
			<LinkContainer key={key} to={`${url}`} className={cls.join(' ')}>
				<NavItem>{label}</NavItem>
			</LinkContainer>
		);

		return displaySubNav
			? [
					Link,
					<SubNav
						containsSubPages
						key={`sub-nav-${key}`}
						menuItems={items}
					/>,
			  ]
			: Link;
	};
}

const NavHeader = ({ header }) => (
	<NavItem disabled className="nav-header">
		{header}
	</NavItem>
);

const SubNav = ({
	menuItems = [],
	containsSubPages = false,
	activeTopPage,
	header,
	inContainer,
}) => {
	const cls = containsSubPages
		? 'nav-page-second'
		: inContainer ? 'nav-page' : 'nav-page-new';
	return (
		<Nav bsStyle="pills" className={cls} stacked>
			{header && <NavHeader header={header} />}
			{menuItems.map(renderLink(activeTopPage))}
		</Nav>
	);
};

const SubMenu = ({
	menuBlock = {},
	activePageId,
	displaySingleItem = false,
	displayHeader,
	inContainer,
}) => {
	const { items = [] } = menuBlock;
	const activeTopPage = findActivePage(activePageId, items);
	const onePageWithChildren =
		items.length === 1 && items[0].items && items[0].items.length > 0;
	return displaySingleItem || items.length > 1 || onePageWithChildren ? (
		<div className="sub-menu">
			<SubNav
				menuItems={items}
				activeTopPage={activeTopPage}
				header={displayHeader && menuBlock.label}
				inContainer={inContainer}
			/>
		</div>
	) : null;
};

SubMenu.propTypes = {
	activePageId: PropTypes.string,
	displayHeader: PropTypes.bool,
	displaySingleItem: PropTypes.bool,
	inContainer: PropTypes.bool,
	menuBlock: PropTypes.object,
};

export default SubMenu;
