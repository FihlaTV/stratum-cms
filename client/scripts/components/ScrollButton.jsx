import React from 'react';

const ScrollButton = () => {
	return (<a onClick={function scrollToTop () { scroll(0, 0); }} className="scrollbutton">UPP</a>);
};
export default ScrollButton;
