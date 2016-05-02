import { SHOW_CONTEXT_MODAL } from '../actions/actions';

const initialState = {
	showModal: false
};

export default (state = initialState, action) => {
	switch (action.type){
        case SHOW_CONTEXT_MODAL:
            return Object.assign({}, state, {
                showModal: !state.showModal,
				modalTarget: action.target
            });
      	default:
			return state;
	}
}
