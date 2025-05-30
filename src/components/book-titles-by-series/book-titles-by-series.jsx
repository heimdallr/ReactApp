import "./book-titles-by-series.css";
import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import Spinner from "../spinner";
import { withErrorBoundary } from "../hoc-helpers";

class BookTitlesBySeries extends Component {
  state = {
    loading: false,
    titlesList: [],
    sortHeadID: "",
    sortRevers: false,
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.getRecords();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedItemID !== this.props.selectedItemID) {
      this.setState({ loading: true });
      this.getRecords();
    }
  }

  getRecords = () => {
    const { selectedItemID } = this.props;
    // this.setState({ searchTmp: search });
    this.props.apiData
      .getSearchSeriesBooks({ selectedItemID })
      .then((res) => this.setState({ ...res, loading: false }));
  };

  tableRecords = () => {
    const result =
      this.state.sortHeadID === ""
        ? this.state.titlesList
        : this.state.titlesList.sort((a, b) => {
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
      const colorStyle = item.BookID === this.props.selectedBookID ? "text-dark bg-warning" : "text-light";
      const starRating = Array(item.LibRate * 1 + 1).join("☆");
      const bookSize =
        item.BookSize > 1000 * 1000
          ? `${(item.BookSize / 1024 / 1024).toFixed(1)} M`
          : `${(item.BookSize / 1024).toFixed(1)} k`;
      return (
        <tr className={colorStyle} key={item.BookID} onClick={() => this.props.handleSelectItem(item.BookID)}>
          <td>{item.Title}</td>
          {item.AuthorsNames.includes(",") ? (
            <td>{item.AuthorsNames}</td>
          ) : (
            <td
              className="text-info alias"
              onClick={() => {
                this.props.handleAuthorSelection(item.AuthorsNames);
              }}
            >
              {item.AuthorsNames}
            </td>
          )}
          <td className="text-center">{item.SeqNumber === null ? "" : item.SeqNumber}</td>
          <td className="text-center">{item.BookSize === null ? "" : bookSize}</td>
          <td>{item.Genres === null ? "" : item.Genres}</td>
          <td className="text-center">{item.LibRate === null ? "" : starRating}</td>
          <td className="text-center">{item.Lang === null ? "" : item.Lang}</td>
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
    // const { search } = this.props;
    const { loading, titlesList } = this.state;
    return (
      <React.Fragment>
        <div className="shadow bookTitlesBySeries overflow-auto">
          {loading && <Spinner />}
          {titlesList.length > 0 ? (
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
                  <th className="pl-2 pr-2" onClick={() => this.handleSortHead("Title")}>
                    Названия
                  </th>
                  <th className="pl-2 pr-2" onClick={() => this.handleSortHead("AuthorsNames")}>
                    Авторы
                  </th>
                  <th className="pl-2 pr-2" onClick={() => this.handleSortHead("SeqNumber")}>
                    #
                  </th>
                  <th className="pl-2 pr-2" onClick={() => this.handleSortHead("BookSize")}>
                    Размер
                  </th>
                  <th className="pl-2 pr-2" onClick={() => this.handleSortHead("Genres")}>
                    Жанры
                  </th>
                  <th className="pl-2 pr-2" onClick={() => this.handleSortHead("LibRate")}>
                    ☆
                  </th>
                  <th className="pl-2 pr-2" onClick={() => this.handleSortHead("Lang")}>
                    ⚐
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>{this.tableRecords()}</AnimatePresence>
              </tbody>
            </motion.table>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default withErrorBoundary(BookTitlesBySeries);
