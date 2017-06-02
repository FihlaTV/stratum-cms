export const SHOW_SCROLL_BUTTON = 'SHOW_SCROLL_BUTTON';

export function showScrollButton (show) {
	return {
		type: SHOW_SCROLL_BUTTON,
		show: show,
	};
}
