import React from 'react';
import StratumSimpleData from './StratumSimpleData';

const SimpleSideWidget = ({ url, description, format, formatFn, root }) => {
	return (
		<div>
			<div className="side-widget">
				<StratumSimpleData
					unstyled
					url={url}
					format={format}
					formatFn={formatFn}
					root={root}
					className="side-widget-digit"
				>
					<span className="side-widget-description">
						{description}
					</span>
				</StratumSimpleData>
			</div>
		</div>
	);
};

SimpleSideWidget.defaultProps = {};

export default SimpleSideWidget;
