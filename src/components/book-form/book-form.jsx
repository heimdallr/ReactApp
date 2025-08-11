import "./book-form.css";
import React, { Component } from "react";
import Spinner from "../spinner";
import { WithDragMotion, withErrorBoundary } from "../hoc-helpers";
import BookContent from "../book-content";
import BookControl from "../book-control/book-control";
import BookDescription from "../book-description/book-description";

class BookForm extends Component {
  state = {
    loading: false,
    bookContentLoading: false,
    bookForm: {},
    annotation: "",
    publisher: "",
    city: "",
    year: "",
    isbn: "",
    authors: [],
    series: [],
    displayBookContent: false,
    maximazed: false,
    bookContent: null,
    bookCover: null,
    formFontSize: 2,
    autoScrollContent: false,
    scrollSpeed: 10,
    navTags: [],
  };
  componentDidMount() {
    this.getRecord();
    document.addEventListener("keydown", this.keydownFunction, false);
    this.setState({
      formFontSize: localStorage.getItem("userFontSize") ? localStorage.getItem("userFontSize") * 1 : 1.5,
      scrollSpeed: localStorage.getItem("scrollSpeed") ? localStorage.getItem("scrollSpeed") * 1 : 10,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedItemID !== this.props.selectedItemID) {
      this.setState({ bookContentLoading: true, loading: true, navTags: [] });
      this.getRecord();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keydownFunction, false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.selectedItemID !== nextProps.selectedItemID || this.state !== nextState) {
      return true;
    }
    return false;
  }

  getRecord = () => {
    this.setState({
      loading: true,
      bookContentLoading: true,
      bookContent: null,
      bookCover: null,
      bookForm: {},
      annotation: "",
      publisher: "",
      city: "",
      year: "",
      isbn: "",
      authors: [],
      series: [],
      navTags: [],
      navTagsReady: false,
    });
    const { selectedItemID } = this.props;
    this.props.apiData.getBookForm({ selectedItemID }).then((res) => {
      this.setState({ ...res, loading: false });
      this.getBookCover(selectedItemID);
    });
  };
  getBookCover = (selectedItemID) => {
    this.props.apiData.getCover({ BookID: selectedItemID }).then((res) => {
      this.setState({ bookCover: URL.createObjectURL(res), loading: false });
      this.getBookContent(selectedItemID);
    });
  };

  getBookContent = (selectedItemID) => {
    this.props.apiData
      .getBook({ BookID: selectedItemID })
      .then((res) => this.setState({ bookContent: res, bookContentLoading: false }));
  };

  authorsList = () => {
    const result = this.state.authors.map((item, index) => {
      const FirstName = item.FirstName ? ` ${item.FirstName}` : "";
      const MiddleName = item.MiddleName ? ` ${item.MiddleName}` : "";
      return (
        <span
          key={item.AuthorID}
          onClick={() => {
            this.props.handleAuthorSelection(`${item.LastName}${FirstName}${MiddleName}`);
          }}
        >
          {index ? ", " : ""}
          <span className="alias text-info">
            {item.LastName}
            {item.FirstName ? ` ${item.FirstName}` : ""}
            {item.MiddleName ? ` ${item.MiddleName}` : ""}
          </span>
        </span>
      );
    });
    return result;
  };

  seriesList = () => {
    const result = this.state.series.map((item, index) => {
      return (
        <span
          key={item.SeriesID}
          onClick={() => {
            this.props.handleSeriesSelection(item.SeriesTitle);
          }}
        >
          {index ? ", " : ""}
          <span className="alias text-info">
            {item.SeriesTitle} {item.SeqNumber}
          </span>
        </span>
      );
    });
    return result;
  };

  handleBookContent = () => {
    this.setState((prevState) => ({
      displayBookContent: !prevState.displayBookContent,
      autoScrollContent: false,
      maximazed: false,
    }));
  };

  handleMaximazeBookContent = () => {
    this.storeContentPosition();

    this.setState((prevState) => {
      return {
        maximazed: !prevState.maximazed,
        autoScrollContent: false,
      };
    });
  };

  handleAutoScrollContent = () => {
    this.setState((prevState) => {
      return {
        autoScrollContent: !prevState.autoScrollContent,
      };
    });
  };

  keydownFunction = (e) => {
    // Esc
    if (e.key === "Escape") {
      this.props.handleSelectItem(null);
    }
    // Page Down || Space
    if ((e.keyCode === 34 || e.keyCode === 32) && this.state.displayBookContent) {
      e.preventDefault();
      const scrollableDiv = document.getElementById("scrollableDiv");
      scrollableDiv.scrollTo(0, scrollableDiv.clientHeight + scrollableDiv.scrollTop - 30);
    }
    // Page Up
    if (e.keyCode === 33 && this.state.displayBookContent) {
      e.preventDefault();
      const scrollableDiv = document.getElementById("scrollableDiv");
      scrollableDiv.scrollTo(0, scrollableDiv.scrollTop - scrollableDiv.clientHeight + 30);
    }
    // Arrow Up
    if (e.keyCode === 38 && this.state.displayBookContent) {
      e.preventDefault();
      const scrollableDiv = document.getElementById("scrollableDiv");
      scrollableDiv.scrollTo(0, scrollableDiv.scrollTop - 50);
    }
    //Arrow Down
    if (e.keyCode === 40 && this.state.displayBookContent) {
      e.preventDefault();
      const scrollableDiv = document.getElementById("scrollableDiv");
      scrollableDiv.scrollTo(0, scrollableDiv.scrollTop + 50);
    }
    // Home
    if (e.keyCode === 36 && this.state.displayBookContent) {
      e.preventDefault();
      const scrollableDiv = document.getElementById("scrollableDiv");
      scrollableDiv.scrollTo(0, 0);
    }
    // End
    if (e.keyCode === 35 && this.state.displayBookContent) {
      e.preventDefault();
      const scrollableDiv = document.getElementById("scrollableDiv");
      scrollableDiv.scrollTo(0, scrollableDiv.scrollHeight);
    }
    // Enter
    if (e.keyCode === 13 && this.state.displayBookContent && this.state.bookForm) {
      e.preventDefault();
      this.handleMaximazeBookContent();
    }
    // + ScrollSpeed
    if (e.keyCode === 107 && this.state.displayBookContent && this.state.bookForm && this.state.autoScrollContent) {
      e.preventDefault();
      this.handleIncScrollSpeed();
    }
    // - ScrollSpeed
    if (e.keyCode === 109 && this.state.displayBookContent && this.state.bookForm && this.state.autoScrollContent) {
      e.preventDefault();
      this.handleDecScrollSpeed();
    }
    // + FontSize
    if (e.keyCode === 107 && this.state.displayBookContent && this.state.bookForm && !this.state.autoScrollContent) {
      e.preventDefault();
      this.handleIncFormFontSize();
    }
    // - FontSize
    if (e.keyCode === 109 && this.state.displayBookContent && this.state.bookForm && !this.state.autoScrollContent) {
      e.preventDefault();
      this.handleDecFormFontSize();
    }
    // Ins - autoscroll
    if (e.keyCode === 96 && this.state.displayBookContent && this.state.bookForm) {
      e.preventDefault();
      this.handleAutoScrollContent();
    }
  };

  storeContentPosition = () => {
    const scrollableDiv = document.getElementById("scrollableDiv");
    if (scrollableDiv) {
      const { top } = scrollableDiv.getBoundingClientRect();
      const elCollection = scrollableDiv.getElementsByTagName("p");
      for (let i = 0; i < elCollection.length; i++) {
        if (elCollection[i].getBoundingClientRect().top >= top) {
          localStorage.setItem("currentObject", i);
          localStorage.setItem(
            "currentObjectPosition",
            elCollection[i].getBoundingClientRect().top - scrollableDiv.getBoundingClientRect().top
          );
          break; // Found the first visible one, exit loop
        }
      }
    }
  };

  handleIncFormFontSize = () => {
    this.storeContentPosition();
    this.setState({ autoScrollContent: false });
    this.setState((prevState) => {
      if (prevState.formFontSize <= 5) {
        localStorage.setItem("userFontSize", prevState.formFontSize + 0.1);
        return {
          formFontSize: prevState.formFontSize + 0.1,
        };
      }
    });
  };

  handleDecFormFontSize = () => {
    this.storeContentPosition();
    this.setState({ autoScrollContent: false });
    this.setState((prevState) => {
      if (prevState.formFontSize > 0.6) {
        localStorage.setItem("userFontSize", prevState.formFontSize - 0.1);
        return {
          formFontSize: prevState.formFontSize - 0.1,
        };
      }
    });
  };

  handleIncScrollSpeed = () => {
    this.setState((prevState) => {
      if (prevState.scrollSpeed < 20) {
        localStorage.setItem("scrollSpeed", prevState.scrollSpeed + 1);
        return {
          scrollSpeed: prevState.scrollSpeed + 1,
        };
      }
    });
  };

  handleDecScrollSpeed = () => {
    this.setState((prevState) => {
      if (prevState.scrollSpeed > 1) {
        localStorage.setItem("scrollSpeed", prevState.scrollSpeed - 1);
        return {
          scrollSpeed: prevState.scrollSpeed - 1,
        };
      }
    });
  };
  handleNavTags = (navTags) => {
    this.setState({ navTags });
  };

  render() {
    const {
      bookForm: { BookID, Title, SeriesTitle, LibRate, FileName, BookSize, Genres, Ext },
      annotation,
      publisher,
      city,
      year,
      isbn,
      maximazed,
      bookContent,
      formFontSize,
      autoScrollContent,
      scrollSpeed,
      loading,
      bookContentLoading,
      displayBookContent,
      bookCover,
      navTags,
    } = this.state;
    const { linkToExtBookReader } = this.props;
    const readerPosition = localStorage.getItem(FileName) * 1;
    const styleContentMaximazed = {
      position: "fixed",
      top: "50%",
      left: "50%",
      zIndex: 1,
    };
    const content = loading ? (
      <Spinner />
    ) : (
      <span className="card bg-dark shadow border border-info rounded-lg">
        <BookControl
          handleDecScrollSpeed={this.handleDecScrollSpeed}
          handleAutoScrollContent={this.handleAutoScrollContent}
          handleIncScrollSpeed={this.handleIncScrollSpeed}
          handleDecFormFontSize={this.handleDecFormFontSize}
          handleIncFormFontSize={this.handleIncFormFontSize}
          handleMaximazeBookContent={this.handleMaximazeBookContent}
          handleSelectItem={this.props.handleSelectItem}
          handleBookContent={this.handleBookContent}
          FileName={FileName}
          autoScrollContent={autoScrollContent}
          scrollSpeed={scrollSpeed}
          maximazed={maximazed}
          Title={Title}
          readerPosition={readerPosition}
          displayBookContent={displayBookContent}
          bookContentLoading={bookContentLoading}
          navTags={navTags}
        />

        {displayBookContent && bookContent ? (
          <BookContent
            apiData={this.props.apiData}
            BookID={BookID}
            FileName={FileName}
            maximazed={maximazed}
            bookContent={bookContent}
            formFontSize={formFontSize}
            autoScrollContent={autoScrollContent}
            scrollSpeed={scrollSpeed}
            handleAutoScrollContent={this.handleAutoScrollContent}
            handleNavTags={this.handleNavTags}
          />
        ) : (
          <BookDescription
            bookForm={this.state.bookForm}
            handleBookContent={this.handleBookContent}
            _baseUrl={this.props.apiData.apiData._baseUrl}
            annotation={annotation}
            publisher={publisher}
            city={city}
            year={year}
            isbn={isbn}
            authorsList={this.authorsList}
            seriesList={this.seriesList}
            bookContentLoading={bookContentLoading}
            bookCover={bookCover}
            linkToExtBookReader={linkToExtBookReader}
          />
        )}
      </span>
    );

    if (this.props.selectedItemID === null) return <></>;
    return (
      <>
        {maximazed ? (
          <div style={styleContentMaximazed} className="book-form">
            {content}
          </div>
        ) : (
          <WithDragMotion>
            <div className={`book-form`}>{content}</div>
          </WithDragMotion>
        )}
      </>
    );
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export default withErrorBoundary(BookForm);
