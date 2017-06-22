import React from 'react';

const ScrollButton = () => {
	var pageIsCropped = document.body.scrollHeight > window.innerHeight ? '' : 'hidden';
	return (<a onClick={function scrollToTop () { scroll(0, 0); }} className={`scrollbutton ${pageIsCropped}`}>UPP</a>);
};
export default ScrollButton;
