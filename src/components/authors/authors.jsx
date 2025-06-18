import "./authors.css";
import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import Spinner from "../spinner";
import BookTitles from "../book-titles";
import BookTitlesByAuthor from "../book-titles-by-author";
import { withErrorBoundary } from "../hoc-helpers";

class Authors extends Component {
  state = {
    loading: false,
    searchTmp: "",
    authorsList: [],
    sortHeadID: "",
    sortRevers: false,
    selectedItemID: null,
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.getRecords();
  }

  componentDidUpdate(prevProps) {
    //change group or activate search
    if (
      prevProps.selectedGroupID !== this.props.selectedGroupID &&
      (this.props.selectedGroupID || (this.props.selectedGroupID === 0 && this.props.search.length > 2))
    ) {
      this.setState({ loading: true, selectedItemID: null });
      this.getRecords();
    }
    //change search string
    if (this.state.searchTmp !== this.props.search && this.props.search.length > 2 && this.state.loading === false) {
      this.setState({ loading: true, selectedItemID: null });
      this.getRecords();
    }
  }

  getRecords = () => {
    const { search, selectedGroupID } = this.props;
    this.setState({ searchTmp: search });
    this.props.apiData.getSearchAuthors({ search, selectedGroupID }).then((res) => {
      this.setState({ ...res, loading: false });
      if (res.authorsList.length === 1) this.setState({ selectedItemID: res.authorsList[0].AuthorID });
    });
  };

  tableRecords = () => {
    const result = this.state.authorsList.sort((a, b) => {
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
      const colorStyle = item.AuthorID === this.state.selectedItemID ? "text-dark bg-warning" : "text-light";
      return (
        <tr className={colorStyle} key={item.AuthorID} onClick={() => this.setState({ selectedItemID: item.AuthorID })}>
          <td>{item.Authors}</td>
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
    const { loading, authorsList } = this.state;
    return (
      <React.Fragment>
        <div className="d-flex shadow mt-0 text-center">
          <div className="authors">
            {loading && <Spinner />}
            {authorsList.length > 0 ? (
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
                    <th onClick={() => this.handleSortHead("Authors")}> Авторы</th>
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
            <BookTitlesByAuthor
              selectedItemID={this.state.selectedItemID}
              selectedBookID={this.props.selectedItemID}
              apiData={this.props.apiData}
              handleSeriesSelection={this.props.handleSeriesSelection}
              handleSelectItem={this.props.handleSelectItem}
              selectedGroupID={this.props.selectedGroupID}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export default withErrorBoundary(Authors);
