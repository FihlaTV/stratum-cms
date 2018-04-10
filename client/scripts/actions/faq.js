import fetch from '../utils/testable-fetch';
export const QUESTIONS = 'QUESTIONS';
export const CLEAR_QUESTIONS = 'CLEAR_QUESTIONS';

export function questions(questionsArray) {
	return { type: QUESTIONS, questions: questionsArray };
}

export function getQuestions(categoriesArray) {
	var url =
		'/api/questions' +
		(categoriesArray ? '/category/' + categoriesArray.join(',') : '');
	return dispatch => {
		return fetch(url)
			.then(res => res.json())
			.then(json => dispatch(questions(json.data)));
	};
}

export function clearQuestions() {
	return { type: CLEAR_QUESTIONS };
}
