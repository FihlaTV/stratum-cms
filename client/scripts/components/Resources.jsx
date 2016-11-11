import React from 'react';
import { Col } from 'react-bootstrap';

const Resources = ({ resources }) => (
	<Col md={4}>
		<div className="resource-list">
			<h2>Dokument att ladda ner</h2>
			<ul>
				{resources.map(resource => (
					<li key={resource._id}>
						<i className="resource-icon resource-image"></i>
						<a href={resource.fileUrl}>{resource.title}</a>
						<p>{resource.description}</p>
					</li>
				))}
			</ul>
		</div>
	</Col>
);

export default Resources;
