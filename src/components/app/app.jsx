import React, { Component } from "react";
import FetchBooks from "../../fetch/fetch-books";
import ScopeSelector from "../scope-selector/scope-selector";
import "./app.css";
import SearchPanel from "../search-panel";
import Spinner from "../spinner";
import Authors from "../authors";
import BookTitles from "../book-titles";
import BookSeries from "../book-series";
import BookForm from "../book-form";
import { withErrorBoundary } from "../hoc-helpers";

class App extends Component {
  state = {
    loading: false,
    search: "",
    searchTmp: "",
    searchStats: { authors: 0, bookSeries: 0, bookTitles: 0 },
    scope: "bookTitles",
    genres: [],
    groups: [],
    selectedGroupID: 0,
    selectedItemID: null,
    numberOfBooks: null,
  };

  apiData = new FetchBooks();
  componentDidMount() {
    this.getConfig();
  }

  componentDidUpdate(prevProps, prevState) {
    //change group or activate search
    if (
      prevState.selectedGroupID !== this.state.selectedGroupID &&
      (this.state.selectedGroupID || (this.state.selectedGroupID === 0 && this.state.search.length > 2))
    ) {
      this.setState({ loading: true });
      this.getRecords(this.state.search, this.state.selectedGroupID);
    }

    //change search string
    if (
      prevState.searchTmp !== this.state.searchTmp &&
      this.state.searchTmp.length > 0 &&
      this.state.search.length > 2 &&
      this.state.loading === false
    ) {
      this.setState({ loading: true });
      this.getRecords(this.state.search, this.state.selectedGroupID);
    }

    //activate empty search
    if (
      (prevState.selectedGroupID !== this.state.selectedGroupID || prevState.searchTmp !== this.state.searchTmp) &&
      this.state.selectedGroupID === 0 &&
      this.state.search.length < 3
    ) {
      this.setState({ searchStats: { authors: 0, bookSeries: 0, bookTitles: 0 } });
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  getConfig = () => {
    this.apiData.getConfig().then((res) => this.setState({ ...res, loading: false }));
  };

  getRecords = (search, selectedGroupID) => {
    this.setState({ searchTmp: search });
    this.apiData.getSearchStats({ search, selectedGroupID }).then((res) => this.setState({ ...res, loading: false }));
  };

  tableRecords = () => {
    const result = this.state.itemList.sort((a, b) => {
      if (a[this.state.sortHeadID] === b[this.state.sortHeadID]) {
        return 0;
      }
      if (a[this.state.sortHeadID] === null) {
        return 1;
      }
      if (b[this.state.sortHeadID] === null) {
        return -1;
      }
      if (this.state.sortRevers) {
        return a[this.state.sortHeadID] < b[this.state.sortHeadID] ? 1 : -1;
      }
      return a[this.state.sortHeadID] > b[this.state.sortHeadID] ? 1 : -1;
    });
    return result.map((item) => {
      let star = "";
      switch (item.LibRate) {
        case "1":
          star = "☆";
          break;
        case "2":
          star = "☆☆";
          break;
        case "3":
          star = "☆☆☆";
          break;
        case "4":
          star = "☆☆☆☆";
          break;
        case "5":
          star = "☆☆☆☆☆";
          break;
      }
      return (
        <tr key={item.BookID}>
          <td>{star}</td>
          <td>{item.Title}</td>
          <td>{item.SeriesTitle}</td>
          <td>{item.AuthorsNames}</td>
          <td>{item.BookSize}</td>
          <td>{item.Lang}</td>
        </tr>
      );
    });
  };

  handleScopeSelection = (scope) => {
    this.setState({ scope });
  };

  handleGroupSelection = (selectedGroupID) => {
    this.setState({ selectedGroupID });
  };

  handleSeriesSelection = (search) => {
    if (search.length > 2)
      this.setState({ scope: "bookSeries", searchTmp: search, search: search, selectedGroupID: 0 });
  };

  handleAuthorSelection = (search) => {
    if (search.length > 2) this.setState({ scope: "authors", searchTmp: search, search: search, selectedGroupID: 0 });
  };

  handleSelectItem = (BookID) => {
    this.setState({ selectedItemID: BookID });
  };

  handleSortHead = (ID) => {
    if (this.state.sortHeadID === ID) {
      this.setState(({ sortRevers }) => ({ sortRevers: !sortRevers }));
    } else {
      this.setState({ sortRevers: false, sortHeadID: ID });
    }
  };

  onSearchChange = (e) => {
    clearTimeout(this.timer);
    this.setState({ search: e.target.value });
    this.timer = setTimeout(() => {
      this.setState({
        searchTmp: this.state.search,
      });
    }, 500);
  }; //Поиск с задержкой 1 сек.

  groups = () => {
    const groupsButtons = this.state.groups.map((item) => {
      return (
        <ScopeSelector
          key={item.GroupID}
          handleScopeSelection={this.handleGroupSelection}
          scopeID={item.GroupID}
          scopeName={item.Title}
          scopeQuantity={item.numberOfBooks}
          scope={this.state.selectedGroupID}
        />
      );
    });
    return groupsButtons;
  };

  render() {
    const { authors, bookSeries, bookTitles } = this.state.searchStats;
    const { scope, searchTmp, selectedItemID, selectedGroupID } = this.state;

    return (
      <React.Fragment>
        {selectedItemID && (
          <BookForm
            handleSelectItem={this.handleSelectItem}
            apiData={this.apiData}
            selectedItemID={selectedItemID}
            handleAuthorSelection={this.handleAuthorSelection}
            handleSeriesSelection={this.handleSeriesSelection}
          />
        )}
        <div className="card shadow ">
          <div className="d-flex flex-wrap m-0 p-1 bg-secondary">
            <SearchPanel
              search={this.state.search}
              onSearchChange={this.onSearchChange}
              onFocus={() => this.handleGroupSelection(0)}
            />
            {this.groups()}
            <span className="text-light ml-3">∑ {this.state.numberOfBooks}</span>
            {this.state.loading && <Spinner />}
          </div>
        </div>

        {authors || bookSeries || bookTitles ? (
          <div className="card shadow mt-2">
            <div className="card-title bg-secondary pl-1 pr-1 m-0">
              <ScopeSelector
                handleScopeSelection={this.handleScopeSelection}
                scopeID="bookTitles"
                scopeName="Названий"
                scopeQuantity={bookTitles}
                scope={scope}
              />
              <ScopeSelector
                handleScopeSelection={this.handleScopeSelection}
                scopeID="authors"
                scopeName="Авторов"
                scopeQuantity={authors}
                scope={scope}
              />
              <ScopeSelector
                handleScopeSelection={this.handleScopeSelection}
                scopeID="bookSeries"
                scopeName="Серий"
                scopeQuantity={bookSeries}
                scope={scope}
              />
            </div>
          </div>
        ) : null}
        {scope === "bookSeries" && (searchTmp.length > 2 || selectedGroupID) ? (
          <BookSeries
            search={searchTmp}
            apiData={this.apiData}
            handleAuthorSelection={this.handleAuthorSelection}
            handleSelectItem={this.handleSelectItem}
            selectedItemID={selectedItemID}
            selectedGroupID={selectedGroupID}
          />
        ) : null}
        {scope === "authors" && (searchTmp.length > 2 || selectedGroupID) ? (
          <Authors
            search={searchTmp}
            apiData={this.apiData}
            handleSeriesSelection={this.handleSeriesSelection}
            handleSelectItem={this.handleSelectItem}
            selectedItemID={selectedItemID}
            selectedGroupID={selectedGroupID}
          />
        ) : null}
        {scope === "bookTitles" && (searchTmp.length > 2 || selectedGroupID) ? (
          <BookTitles
            search={searchTmp}
            apiData={this.apiData}
            handleSeriesSelection={this.handleSeriesSelection}
            handleAuthorSelection={this.handleAuthorSelection}
            handleSelectItem={this.handleSelectItem}
            selectedItemID={selectedItemID}
            selectedGroupID={selectedGroupID}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export default withErrorBoundary(App);
