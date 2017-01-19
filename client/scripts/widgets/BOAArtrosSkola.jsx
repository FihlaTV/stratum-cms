import React from 'react';
import StratumSimpleData from './StratumSimpleData';

const BOAArtrosSkola = ({
}) => {
	return (
		<div>
			<div className="side-widget">
				<span
					className="side-widget-digit"
				>
					78%
				</span>
				<span className="side-widget-description">
					av de patienter som går artrosskola mår bättre efter avslutad utbildning
				</span>
			</div>
			<div className="side-widget">
				<StratumSimpleData
					unstyled
					url="/stratum/api/aggregate/BOA/UnitPraxis/Total/count(UP_UnitName)?APIKey=bK3H9bwaG4o%3D"
					className="side-widget-digit"
				>
					<span className="side-widget-description">
						mottagningar över hela landet registrerar i BOA registret idag
					</span>
				</StratumSimpleData>
			</div>
		</div>
	);
};

BOAArtrosSkola.defaultProps = {};

export default BOAArtrosSkola;
