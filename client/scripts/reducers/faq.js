import { QUESTIONS, CLEAR_QUESTIONS } from '../actions/faq';
const initialState = { loading: true, questions: [] };

export default (state = initialState, action) => {
	switch (action.type) {
		case QUESTIONS:
			return Object.assign({}, state, { loading: false, questions: action.questions });
		case CLEAR_QUESTIONS:
			return Object.assign({}, state, { loading: true, questions: [] });
		default:
			return state;
	}
};
