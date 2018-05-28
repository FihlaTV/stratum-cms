import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
	fetchSearchResults,
	changeQuery,
	clearSearchResults,
} from '../actions/search';
// import PropTypes from 'prop-types';

const ResultItem = ({ htmlTitle, link, snippet, htmlSnippet, className }) => (
	<div className={className}>
		<h3>
			<a href={link} dangerouslySetInnerHTML={{ __html: htmlTitle }} />
		</h3>
		<p dangerouslySetInnerHTML={{ __html: htmlSnippet }} />
	</div>
);

class SearchPage extends Component {
	componentDidMount() {
		const {
			params = {},
			fetchSearchResults,
			clearSearchResults,
			location,
		} = this.props;
		if (params.query) {
			fetchSearchResults(params.query, location.query.page);
		} else {
			clearSearchResults();
		}
	}
	componentWillReceiveProps({ params: nextParams, location: nextLocation }) {
		const {
			params,
			location,
			fetchSearchResults,
			clearSearchResults,
		} = this.props;
		if (
			nextParams.query &&
			(nextLocation.query.page !== location.query.page ||
				nextParams.query !== params.query)
		) {
			fetchSearchResults(nextParams.query, nextLocation.query.page);
		}
		if (!nextParams.query && params.query) {
			clearSearchResults();
		}
	}
	render() {
		const {
			inputQuery,
			changeQuery,
			info = {},
			results = [],
			params,
			loading,
		} = this.props;
		const { query } = params;
		return (
			<div className="search-page">
				<h1>Sök</h1>
				<Form
					onSubmit={e => {
						e.preventDefault();
						this.props.router.push({
							pathname: `/sok/${encodeURI(inputQuery)}`,
						});
					}}
					inline
					className="search-bar"
				>
					<FormGroup
						bsSize="large"
						controlId="formBasicText"
						className="search-bar-input-ct"
					>
						<FormControl
							type="text"
							value={inputQuery}
							placeholder="Skriv sökord"
							onChange={e => changeQuery(e.target.value)}
							className="search-bar-input"
						/>
					</FormGroup>{' '}
					<FormGroup>
						<Button
							bsSize="large"
							type="submit"
							bsStyle="primary"
							disabled={loading || query === inputQuery}
						>
							Sök
						</Button>
					</FormGroup>
				</Form>
				{loading ? (
					<span>Loading</span>
				) : (
					<div className="search-results">
						{query && (
							<div className="search-results-description">
								Hittade {info.totalResults} resultat på{' '}
								<strong>{query}</strong>
							</div>
						)}
						{results.map((result, i) => (
							<ResultItem
								{...result}
								key={`search-result-item-${i}`}
								className="search-results-item"
							/>
						))}
					</div>
				)}
			</div>
		);
	}
}

// SearchPage.propTypes = { };
const mapStateToProps = ({ search, menu }, { location }) => {
	return {
		loading: search.loading,
		menu,
		results: search.items,
		inputQuery: search.query,
		info: search.searchInformation,
	};
};
const mapDispatchToProps = dispatch => ({
	// setBreadcrumbs: (...args) => dispatch(setBreadcrumbs(...args)),
	// clearBreadcrumbs: () => dispatch(clearBreadcrumbs()),
	clearSearchResults: () => dispatch(clearSearchResults()),
	fetchSearchResults: (...args) => dispatch(fetchSearchResults(...args)),
	changeQuery: query => dispatch(changeQuery(query)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
