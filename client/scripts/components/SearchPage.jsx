import React, { Component } from 'react';
import {
	Button,
	Form,
	FormGroup,
	FormControl,
	Pagination,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import {
	fetchSearchResults,
	changeQuery,
	clearSearchResults,
	performGoogleSearch,
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
			fetchSearchResults(params.query, location.query.start);
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
			(nextLocation.query.start !== location.query.start ||
				nextParams.query !== params.query)
		) {
			fetchSearchResults(nextParams.query, nextLocation.query.start);
		}
		if (!nextParams.query && params.query) {
			clearSearchResults();
		}
	}
	navigateToPage(startIndex) {
		const { query, pathname } = this.props.location;
		this.props.router.push({
			pathname: pathname,
			query: Object.assign({}, query, {
				start: startIndex === 1 ? undefined : startIndex,
			}),
		});
	}
	paginationItems(totalResults, currentPage, resultsPerPage = 10) {
		const totalPages = Math.ceil(
			parseInt(totalResults, 10) / resultsPerPage
		);
		const startPage = currentPage < 7 ? 1 : currentPage - 5;
		const endPage = Math.min(totalPages, Math.max(10, currentPage + 5));
		const retArr = [];
		for (let i = startPage; i <= endPage; i++) {
			retArr.push(
				<Pagination.Item
					key={`pagination-item-${i}`}
					active={i === currentPage}
					onClick={() => this.navigateToPage(i)}
				>
					{i}
				</Pagination.Item>
			);
		}
		return retArr;
	}
	renderPagination({ nextPage, request, previousPage }) {
		const { totalResults, startIndex } = request[0];
		const currentPage = Math.ceil(startIndex / 10);
		return (
			<Pagination>
				{previousPage && (
					<Pagination.Prev
						// disabled={currentPage === 1}
						onClick={() =>
							this.navigateToPage(previousPage[0].startIndex)
						}
					/>
				)}
				<Pagination.Item active>{currentPage}</Pagination.Item>
				{nextPage && (
					<Pagination.Next
						// disabled={currentPage === Math.ceil(totalResults / 10)}
						onClick={() =>
							this.navigateToPage(nextPage[0].startIndex)
						}
					/>
				)}
			</Pagination>
		);
	}
	render() {
		const {
			inputQuery,
			changeQuery,
			info = {},
			results = [],
			queries,
			params,
			loading,
			location,
			error,
		} = this.props;
		const { query } = params;
		const currentPage = parseInt(location.query.page, 10) || 1;
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
							disabled={
								loading || !inputQuery || query === inputQuery
							}
						>
							Sök
						</Button>
					</FormGroup>
				</Form>
				{error ? (
					<div>
						<p>
							Din sökning kunde inte genomföras,{' '}
							<a
								href="#google-search"
								onClick={e => {
									e.preventDefault();
									performGoogleSearch(params.query);
								}}
							>
								klicka här
							</a>{' '}
							för att söka via Google.
						</p>
					</div>
				) : loading ? (
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
						{queries && this.renderPagination(queries, currentPage)}
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
		error: search.error,
		queries: search.queries,
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
