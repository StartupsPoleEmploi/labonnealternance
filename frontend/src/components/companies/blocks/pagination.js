import React, { Component } from 'react';

export class Pagination extends Component {
    constructor(props) {
        super(props);
        this.PAGE_SIZE = 20;

        let pageNumber = Math.trunc(this.props.companiesCount / this.PAGE_SIZE);
        if (pageNumber === 0) pageNumber = 1;

        this.state =({
            currentPage: 1,
            pageNumber
        });
    }

    paginateResult() {
        let from = this.state.currentPage * this.PAGE_SIZE;

        let to = from + this.PAGE_SIZE;
        if (to > this.props.companiesCount) to = this.props.companiesCount;

        // Call parent to paginate companies
        this.props.applyPagination(from, to);
    }

    nextPage = (event) => {
        let page = this.state.currentPage + 1;
        if (page > this.state.pageNumber) page = this.state.pageNumber;
        this.setState({ currentPage: page });

        this.paginateResult();
    }

    previousPage = (event) => {
        let page = this.state.currentPage - 1;
        if (page === 0) page = 1;
        this.setState({ currentPage: page });

        this.paginateResult();
    }

    render() {
        if (this.state.pageNumber === 1) return null;

        return (
            <div className="pagination">
                {this.state.currentPage === 1 ? null : <button onClick={this.previousPage} title="Page précédente">&lt;</button> }
                { this.state.currentPage } / { this.state.pageNumber }
                {this.state.currentPage >= this.state.pageNumber ? null : <button onClick={this.nextPage} title="Page suivante">&gt;</button> }
            </div>
        );
    }
}