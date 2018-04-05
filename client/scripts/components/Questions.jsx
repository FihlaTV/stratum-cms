import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelGroup } from 'react-bootstrap';

const Questions = ({ faqArr }) => (
	<div>
		{faqArr.map(({ category, questions }) => (
			<div key={category}>
				<h2>{category}</h2>
				<PanelGroup
					accordion
					bsClass="panel-group panel-group-faq"
				>
					{questions.map(({ question, answer }) => (
						<Panel key={question} eventKey={question}>
							<Panel.Heading>
								<Panel.Title toggle>{question}</Panel.Title>
							</Panel.Heading>
							<Panel.Body collapsible>
								<div
									dangerouslySetInnerHTML={{
										__html: answer,
									}}
								/>
							</Panel.Body>
						</Panel>
					))}
				</PanelGroup>
			</div>
		))}
	</div>
);

Questions.propTypes = {
	faqArr: PropTypes.array.isRequired,
};
export default Questions;
