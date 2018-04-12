import React from 'react';
import StratumSimpleData from './StratumSimpleData';

const BOAArtrosSkola = ({}) => {
	return (
		<div>
			<div className="side-widget">
				<StratumSimpleData
					unstyled
					url="/stratum/api/statistics/BOA/boaw-unique-active-units?APIKey=bK3H9bwaG4o%3D"
					className="side-widget-digit"
				>
					<span className="side-widget-description">
						mottagningar över hela landet registrerar i
						BOA-registret.
					</span>
				</StratumSimpleData>
			</div>
		</div>
	);
};

BOAArtrosSkola.defaultProps = {};

export default BOAArtrosSkola;
