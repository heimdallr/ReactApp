import "./book-titles-by-author.css";
import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import Spinner from "../spinner";
import { withErrorBoundary } from "../hoc-helpers";

class BookTitlesByAuthor extends Component {
  state = {
    loading: false,
    titlesList: [],
    sortHeadID: "",
    sortRevers: false,
    selectedItemID: null,
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
    const { selectedItemID, selectedGroupID } = this.props;
    // this.setState({ searchTmp: search });
    this.props.apiData
      .getSearchAuthorBooks({ selectedItemID, selectedGroupID })
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
            if (a[this.state.sortHeadID] * 1 > 0) a[this.state.sortHeadID] = a[this.state.sortHeadID] * 1;
            if (b[this.state.sortHeadID] * 1 > 0) b[this.state.sortHeadID] = b[this.state.sortHeadID] * 1;
            if (this.state.sortRevers) {
              return a[this.state.sortHeadID] < b[this.state.sortHeadID] ? 1 : -1;
            }
            return a[this.state.sortHeadID] > b[this.state.sortHeadID] ? 1 : -1;
          });

    return result.map((item) => {
      const colorStyle = item.BookID === this.props.selectedBookID ? "text-dark bg-warning" : "text-light";
      const starRating = Array(item.LibRate * 1 + 1).join("☆");
      const bookProgress = localStorage.getItem(item.FileName) * 1;
      const bookSize =
        item.BookSize > 1000 * 1000
          ? `${(item.BookSize / 1024 / 1024).toFixed(1)} M`
          : `${(item.BookSize / 1024).toFixed(1)} k`;
      const updateDate = item.UpdateDate
        ? new Date(item.UpdateDate).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "";
      return (
        <tr className={colorStyle} key={item.BookID}>
          <td
            style={{
              background: `${
                bookProgress ? "linear-gradient(90deg,rgba(18, 140, 249, 1) 0%,rgba(18, 140, 249, 0) 80%" : 0
              }`,
            }}
            onClick={() => this.props.handleSelectItem(item.BookID)}
          >
            {bookProgress ? (
              <span className="badge badge-light mr-1 align-top pt-0 pb-0 shadow">{`${Number(
                bookProgress.toFixed(1)
              )}%`}</span>
            ) : (
              ""
            )}
            {item.Title}
          </td>
          <td
            className={`text-info alias`}
            onClick={() => {
              this.props.handleSeriesSelection(item.SeriesTitle);
            }}
          >
            {item.SeriesTitle}
          </td>
          <td className="text-center" onClick={() => this.props.handleSelectItem(item.BookID)}>
            {item.SeqNumber === null ? "" : item.SeqNumber}
          </td>
          <td className="text-center" onClick={() => this.props.handleSelectItem(item.BookID)}>
            {item.Year === null ? "" : item.Year}
          </td>
          <td className="text-center" onClick={() => this.props.handleSelectItem(item.BookID)}>
            {item.BookSize === null ? "" : bookSize}
          </td>
          <td onClick={() => this.props.handleSelectItem(item.BookID)}>{item.Genres === null ? "" : item.Genres}</td>
          <td className="text-center" onClick={() => this.props.handleSelectItem(item.BookID)}>
            {item.LibRate === null ? "" : starRating}
          </td>
          <td className="text-center" onClick={() => this.props.handleSelectItem(item.BookID)}>
            {item.Lang === null ? "" : item.Lang}
          </td>
          <td className="text-center" onClick={() => this.props.handleSelectItem(item.BookID)}>
            {updateDate}
          </td>
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
        <div className="shadow bookTitlesByAuthor overflow-auto">
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
                  <th className="pl-2 pr-2" onClick={() => this.handleSortHead("SeriesTitle")}>
                    Серия
                  </th>
                  <th className="pl-2 pr-2" onClick={() => this.handleSortHead("SeqNumber")}>
                    #
                  </th>
                  <th className="pl-2 pr-2" onClick={() => this.handleSortHead("Year")}>
                    Год
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
                  <th
                    title="В базе существует с..."
                    className="pl-2 pr-2"
                    onClick={() => this.handleSortHead("UpdateDate")}
                  >
                    ∃
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
// eslint-disable-next-line react-refresh/only-export-components
export default withErrorBoundary(BookTitlesByAuthor);
