import fetch from 'isomorphic-fetch';
export const GET_NEWS = 'GET_NEWS';

export function getNews () {
   var data = fetch('/api/news')
       .then(res => res.json)
       .then(json => json.data.messages)
   	return data
}
