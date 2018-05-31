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
import Spinner from '../components/Spinner';
import { setBreadcrumbs, clearBreadcrumbs } from '../actions/breadcrumbs';
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
			title,
			location,
			setBreadcrumbs,
		} = this.props;
		if (params.query) {
			fetchSearchResults(params.query, location.query.start);
		} else {
			clearSearchResults();
		}
		setBreadcrumbs([{ url: '/sok/', label: title }], true, title);
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
	componentWillUnmount() {
		this.props.clearBreadcrumbs();
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
	renderPagination({ nextPage, request, previousPage }) {
		const { startIndex } = request[0];
		const currentPage = Math.ceil(startIndex / 10);
		return (
			<Pagination>
				{previousPage && (
					<Pagination.Prev
						onClick={() =>
							this.navigateToPage(previousPage[0].startIndex)
						}
					/>
				)}
				<Pagination.Item active>{currentPage}</Pagination.Item>
				{nextPage && (
					<Pagination.Next
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
			title,
			error,
		} = this.props;
		const { query } = params;
		const { request } = queries || {};
		const currentPage =
			request && request[0] ? Math.ceil(request[0].startIndex / 10) : 1;
		return (
			<div className="search-page">
				<h1>{title}</h1>
				<Form
					onSubmit={e => {
						e.preventDefault();
						this.props.router.push({
							pathname: `/sok/${encodeURIComponent(inputQuery)}`,
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
								loading ||
								!inputQuery ||
								query === inputQuery.trim()
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
					<Spinner />
				) : (
					<div className="search-results">
						{query && (
							<div className="search-results-description">
								{currentPage > 1
									? `Sida ${currentPage} av`
									: 'Hittade'}{' '}
								{info.totalResults} resultat på{' '}
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
						{queries && this.renderPagination(queries)}
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
	setBreadcrumbs: (...args) => dispatch(setBreadcrumbs(...args)),
	clearBreadcrumbs: () => dispatch(clearBreadcrumbs()),
	clearSearchResults: () => dispatch(clearSearchResults()),
	fetchSearchResults: (...args) => dispatch(fetchSearchResults(...args)),
	changeQuery: query => dispatch(changeQuery(query)),
});

SearchPage.defaultProps = {
	title: 'Sök',
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
