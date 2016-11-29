import React from 'react';
import { Accordion, Panel } from 'react-bootstrap';

const Questions = ({ faqArr, children }) => (
	<div>
		{faqArr.map(categoryObj => (
			<div key={categoryObj.category}>
				<h2>{categoryObj.category}</h2>
				<Accordion bsClass="panel-group panel-group-faq">
					{categoryObj.questions.map(questionObj => <Panel key={questionObj.question} header={questionObj.question} eventKey={questionObj.question} >
						<div dangerouslySetInnerHTML={{ __html: questionObj.answer }}></div>
					</Panel>)}
				</Accordion>
			</div>
		))}
	</div>
);

export default Questions;
