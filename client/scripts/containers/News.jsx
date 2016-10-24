import React, { PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import getNews from '../actions/news';

console.log(getNews);
class News extends React.Component {
    constructor(props) {
      super(props)
      this.state = {loading: true, news: []}
    }
    componentDidMount() {
      fetch('/api/news')
        .then(res => {
          if(res.status >= 400) {
            throw new Error("Bad res from server");
          }
          return res.json();
        })
        .then( news => {
          this.setState({loading: false, news: news.data.messages})
})
}
    render() {
        return this.state.loading ? <h1> Laddar</h1> : <h1> Nyheter!!!</h1> 
    }
}

export default News
