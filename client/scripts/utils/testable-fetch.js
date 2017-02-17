import fetch from 'isomorphic-fetch';

const { NODE_ENV, LOCAL_MOCK_URL = 'http://localhost' } = process.env;

/**
 * Fixes the issue with issue with "nock" not being
 * able to mock requests to relative urls by prepending
 * all relative urls with an absolute url.
 */
export default function (url, ...args) {
	if (NODE_ENV === 'test' && !url.match(/^(https?:){0,1}\/\//)) {
		url = `${LOCAL_MOCK_URL}${url}`;
	}
	return fetch(url, ...args);
};
