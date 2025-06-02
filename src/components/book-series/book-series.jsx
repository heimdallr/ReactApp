import "./book-series.css";
import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import Spinner from "../spinner";
import BookTitlesBySeries from "../book-titles-by-series";
import { withErrorBoundary } from "../hoc-helpers";

class BookSeries extends Component {
  state = {
    loading: false,
    searchTmp: "",
    seriesList: [],
    sortHeadID: "",
    sortRevers: false,
    selectedItemID: null,
  };
  componentDidMount() {
    this.setState({ loading: true });
    this.getRecords();
  }

  componentDidUpdate() {
    if (this.state.searchTmp !== this.props.search && this.props.search.length > 2 && this.state.loading === false) {
      this.setState({ loading: true });
      this.getRecords();
    }
  }

  getRecords = () => {
    const { search } = this.props;
    this.setState({ searchTmp: search });
    this.props.apiData.getSearchSeries({ search }).then((res) => {
      this.setState({ ...res, loading: false });
      if (res.seriesList.length === 1) this.setState({ selectedItemID: res.seriesList[0].SeriesID });
    });
  };

  tableRecords = () => {
    const result = this.state.seriesList.sort((a, b) => {
      if (a[this.state.sortHeadID] === b[this.state.sortHeadID]) {
        return 0;
      }
      if (a[this.state.sortHeadID] === null) {
        return 1;
      }
      if (b[this.state.sortHeadID] === null) {
        return -1;
      }
      if (a[this.state.sortHeadID] == a[this.state.sortHeadID] * 1)
        a[this.state.sortHeadID] = a[this.state.sortHeadID] * 1;
      if (b[this.state.sortHeadID] == b[this.state.sortHeadID] * 1)
        b[this.state.sortHeadID] = b[this.state.sortHeadID] * 1;
      if (this.state.sortRevers) {
        return a[this.state.sortHeadID] < b[this.state.sortHeadID] ? 1 : -1;
      }
      return a[this.state.sortHeadID] > b[this.state.sortHeadID] ? 1 : -1;
    });
    return result.map((item) => {
      const colorStyle = item.SeriesID === this.state.selectedItemID ? "text-dark bg-warning" : "text-light";
      return (
        <tr className={colorStyle} key={item.SeriesID} onClick={() => this.setState({ selectedItemID: item.SeriesID })}>
          <td>{item.SeriesTitle}</td>
          <td className="text-center">{item.Books}</td>
        </tr>
      );
    });
  };

  handleSortHead = (ID) => {
    if (this.state.sortHeadID === ID) {
      this.setState(({ sortRevers }) => ({ sortRevers: !sortRevers }));
    } else {
      this.setState({ sortRevers: false, sortHeadID: ID });
    }
  };

  render() {
    const { loading, seriesList } = this.state;
    return (
      <React.Fragment>
        <div className="d-flex shadow mt-0 text-center">
          <div className="bookSeries overflow-auto">
            {loading && <Spinner />}
            {seriesList.length > 0 ? (
              <motion.table
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
                transition={{ duration: 0.5 }}
                className="table-dark table-striped text-left"
              >
                <thead>
                  <tr>
                    <th className="pl-1 pr-1" onClick={() => this.handleSortHead("SeriesTitle")}>
                      Серии
                    </th>
                    <th className="pl-2 pr-2" onClick={() => this.handleSortHead("Books")}>
                      Книг
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>{this.tableRecords()}</AnimatePresence>
                </tbody>
              </motion.table>
            ) : null}
          </div>
          {this.state.selectedItemID === null ? null : (
            <BookTitlesBySeries
              selectedItemID={this.state.selectedItemID}
              selectedBookID={this.props.selectedItemID}
              apiData={this.props.apiData}
              handleAuthorSelection={this.props.handleAuthorSelection}
              handleSelectItem={this.props.handleSelectItem}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withErrorBoundary(BookSeries);
