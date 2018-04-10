export const NEW_ERROR = 'NEW_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export const newError = (message = '') => ({ type: NEW_ERROR, message });

export const clearError = () => ({ type: CLEAR_ERROR });
