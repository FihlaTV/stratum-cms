export function findFirstPageInMenu(menuKey, menuItems = []) {
	const menuBlock = menuItems.find(item => item.key === menuKey);
	if (menuBlock && menuBlock.items && menuBlock.items.length > 0) {
		return menuBlock.items[0];
	}

	return null;
}
export function findMenuBlock(pageId, menuItems = [], level = 0) {
	if (!pageId) {
		return;
	}
	const matches = menuItems.filter(menuItem => {
		if (menuItem.items && menuItem.pageKey !== pageId) {
			return findMenuBlock(pageId, menuItem.items, level + 1);
		}
		return pageId === menuItem.pageKey;
	});
	if (matches.length > 0) {
		return level === 0 ? matches[0] : true;
	}
	return undefined;
}
export function containsMenuBlock(menuId, menuItems = []) {}
