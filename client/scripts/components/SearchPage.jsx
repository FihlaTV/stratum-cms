import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchSearchResults, changeQuery } from '../actions/search';
// import PropTypes from 'prop-types';

const ResultItem = ({ title, link, snippet }) => (
	<div>
		<h3>
			<a href={link}>{title}</a>
		</h3>
		<p>{snippet}</p>
	</div>
);

class SearchPage extends Component {
	render() {
		const {
			query,
			fetchSearchResults,
			changeQuery,
			results = [],
		} = this.props;
		return (
			<div>
				<h1>Sök</h1>
				<Form
					onSubmit={e => {
						e.preventDefault();
						fetchSearchResults(query);
					}}
					inline
					style={{ display: 'flex' }}
				>
					<FormGroup
						bsSize="large"
						controlId="formBasicText"
						style={{ flex: 1, marginRight: 5 }}
					>
						<FormControl
							type="text"
							style={{ width: '100%' }}
							value={query}
							placeholder="Skriv sökord"
							onChange={e => changeQuery(e.target.value)}
						/>
					</FormGroup>{' '}
					<FormGroup>
						<Button bsSize="large" type="submit" bsStyle="primary">
							Sök
						</Button>
					</FormGroup>
				</Form>
				<div>
					{results.map((result, i) => (
						<ResultItem
							{...result}
							key={`search-result-item-${i}`}
						/>
					))}
				</div>
			</div>
		);
	}
}

// SearchPage.propTypes = { };
const mapStateToProps = ({ search, menu }) => {
	return {
		loading: search.loading,
		menu,
		results: search.items,
		query: search.query,
	};
};
const mapDispatchToProps = dispatch => ({
	// setBreadcrumbs: (...args) => dispatch(setBreadcrumbs(...args)),
	// clearBreadcrumbs: () => dispatch(clearBreadcrumbs()),
	fetchSearchResults: query => dispatch(fetchSearchResults(query)),
	changeQuery: query => dispatch(changeQuery(query)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
