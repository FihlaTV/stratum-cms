import React from 'react';

const ScrollButton = ({
	show,
	}) => {
	return (<a onClick={
	function scrollToTop () { scroll(0, 0); }} className="base-page-top-button" style={{ visibility: show }}>UPP</a>);
};
export default ScrollButton;
