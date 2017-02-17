import React from 'react';
import Icon from 'react-fontawesome';

const PrintButton = () => (
	<a href="#print" onClick={(e) => { e.preventDefault(); window.print(); }} className="print-button">
		<Icon name="print" />
	</a>
);

export default PrintButton;
