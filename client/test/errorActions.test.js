import { NEW_ERROR, CLEAR_ERROR, newError, clearError } from '../scripts/actions/error';

describe('newError action', () => {
	test('newError sends an action with type: NEW_ERROR and a message', () => {
		const expectedAction = { type: NEW_ERROR, message: 'Error message' };

		expect(newError('Error message')).toEqual(expectedAction);
	});

	test(
        'newError sends an action with type: NEW_ERROR and an empty string when not passed a message',
        () => {
	const expectedAction = { type: NEW_ERROR, message: '' };

	expect(newError()).toEqual(expectedAction);
}
    );
});

describe('clearError action', () => {
	test('clearError sends an action with type: CLEAR_ERROR', () => {
		const expectedAction = { type: CLEAR_ERROR };

		expect(clearError()).toEqual(expectedAction);
	});
});
