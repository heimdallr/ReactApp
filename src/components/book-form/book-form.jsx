import "./book-form.css";
import React, { Component } from "react";
import Spinner from "../spinner";
import { WithDragMotion, withErrorBoundary } from "../hoc-helpers";
import BookContent from "../book-content";

class BookForm extends Component {
  state = {
    loading: false,
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
    formFontSize: 1,
  };
  componentDidMount() {
    this.getRecord();
    document.addEventListener("keydown", this.keydownFunction, false);
    this.setState({
      formFontSize: localStorage.getItem("userFontSize") ? localStorage.getItem("userFontSize") * 1 : 1,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedItemID !== this.props.selectedItemID) {
      this.setState({ loading: true, bookForm: {} });
      this.getRecord();
    }
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.keydownFunction, false);
  }

  getRecord = () => {
    this.setState({ loading: true, bookContent: null, bookForm: {} });
    const { selectedItemID } = this.props;
    this.props.apiData.getBookForm({ selectedItemID }).then((res) => this.setState({ ...res }));
    this.props.apiData
      .getBook({ BookID: selectedItemID })
      .then((res) => this.setState({ bookContent: res, loading: false }));
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
      maximazed: false,
    }));
  };

  handleMaximazeBookContent = (BookID) => {
    localStorage.setItem("currentPosition", localStorage.getItem(BookID));
    this.setState((prevState) => ({
      maximazed: !prevState.maximazed,
    }));
  };

  keydownFunction = (e) => {
    if (e.key === "Escape") {
      this.props.handleSelectItem(null);
      //Do whatever when esc is pressed
    }
    if (e.keyCode === 34 && this.state.displayBookContent) {
      e.preventDefault();
      const scrollableDiv = document.getElementById("scrollableDiv");
      scrollableDiv.scrollTo(0, scrollableDiv.clientHeight + scrollableDiv.scrollTop - 10);
    }
    if (e.keyCode === 33 && this.state.displayBookContent) {
      e.preventDefault();
      const scrollableDiv = document.getElementById("scrollableDiv");
      scrollableDiv.scrollTo(0, scrollableDiv.scrollTop - scrollableDiv.clientHeight + 10);
    }
    if (e.keyCode === 38 && this.state.displayBookContent) {
      e.preventDefault();
      const scrollableDiv = document.getElementById("scrollableDiv");
      scrollableDiv.scrollTo(0, scrollableDiv.scrollTop - 50);
    }
    if (e.keyCode === 40 && this.state.displayBookContent) {
      e.preventDefault();
      const scrollableDiv = document.getElementById("scrollableDiv");
      scrollableDiv.scrollTo(0, scrollableDiv.scrollTop + 50);
    }
    if (e.keyCode === 36 && this.state.displayBookContent) {
      e.preventDefault();
      const scrollableDiv = document.getElementById("scrollableDiv");
      scrollableDiv.scrollTo(0, 0);
    }
  };

  handleIncFormFontSize = (BookID) => {
    localStorage.setItem("currentPosition", localStorage.getItem(BookID));
    this.setState((prevState) => {
      if (prevState.formFontSize < 3) {
        localStorage.setItem("userFontSize", prevState.formFontSize + 0.1);
        return {
          formFontSize: prevState.formFontSize + 0.1,
        };
      }
    });
  };

  handleDecFormFontSize = (BookID) => {
    localStorage.setItem("currentPosition", localStorage.getItem(BookID));
    this.setState((prevState) => {
      if (prevState.formFontSize > 0.6) {
        localStorage.setItem("userFontSize", prevState.formFontSize + 0.1);
        return {
          formFontSize: prevState.formFontSize - 0.1,
        };
      }
    });
  };

  render() {
    const { BookID, Title, SeriesTitle, SeqNumber, LibRate, FileName, BookSize, Genres, Ext } = this.state.bookForm;
    const { annotation, publisher, city, year, isbn, maximazed, bookContent, formFontSize } = this.state;

    const content = this.state.loading ? (
      <Spinner />
    ) : (
      <span className="card bg-dark shadow border border-info rounded-lg">
        {/* <div className="" onPointerDownCapture={(e) => e.stopPropagation()}> */}
        <div className="d-flex flex-row mb-1 justify-content-center form-header">
          {this.state.displayBookContent ? (
            // Return Back to form
            <span
              className="btn btn-sm btn-outline-warning ml-3 mt-1 pt-0 pb-0 mr-auto align-self-baseline"
              onClick={this.handleBookContent}
            >
              Назад
            </span>
          ) : (
            //Read selector
            <span
              className="btn btn-sm btn-outline-warning ml-3 mt-1 pt-0 pb-0 mr-auto align-self-baseline"
              onClick={this.handleBookContent}
            >
              Читать
            </span>
          )}

          {/* Progress */}
          {this.state.displayBookContent ? (
            <span id="progress" className="text-info p-0 pb-0 mt-1"></span>
          ) : (
            <div className="text-center h2 neon-text pl-3 pr-3 mr-1 ml-1">{Title}</div>
          )}

          <span className="ml-auto p-0 align-self-baseline mr-1 mt-1 align-self-baseline">
            {this.state.displayBookContent ? (
              <span>
                {/* Font size */}
                <span className="mr-5">
                  <span
                    className="bg-warning p-0 btn btn-sm text-dark align-self-baseline mr-1"
                    onClick={() => {
                      this.handleDecFormFontSize(BookID);
                    }}
                  >
                    ➖
                  </span>
                  <span className="mr-1">👀</span>
                  <span
                    className="mr-1 bg-warning p-0 btn btn-sm text-dark align-self-baseline"
                    onClick={() => {
                      this.handleIncFormFontSize(BookID);
                    }}
                  >
                    ➕
                  </span>
                </span>
                {/* Max Min */}
                <span
                  className="mr-3 bg-warning p-0 btn btn-sm text-dark"
                  onClick={() => {
                    this.handleMaximazeBookContent(BookID);
                  }}
                >
                  {maximazed ? "📜" : "📖"}
                </span>
              </span>
            ) : null}

            {/* Close */}
            <span
              title="Закрыть"
              className="bg-info p-0 btn btn-sm"
              onClick={() => {
                this.props.handleSelectItem(null);
              }}
            >
              ❌
            </span>
          </span>
        </div>
        {this.state.displayBookContent ? (
          <BookContent
            apiData={this.props.apiData}
            BookID={BookID}
            maximazed={maximazed}
            bookContent={bookContent}
            formFontSize={formFontSize}
          />
        ) : (
          <>
            <div className="d-flex align-items-center justify-content-center">
              <table className="table-dark table-striped text-left" onClick={this.handleBookContent}>
                <tbody>
                  <tr>
                    <td className="hover-image-scale p-0">
                      {FileName && (
                        <img
                          className="coverImage"
                          src={`${this.props.apiData.apiData._baseUrl}Images/covers/${BookID}`}
                          alt={`Cover  ${FileName}`}
                        />
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="book-stat">
                <table className="table-dark table-striped text-left">
                  <tbody>
                    {annotation && (
                      <tr>
                        <td className="annotation" colSpan={2} dangerouslySetInnerHTML={{ __html: annotation }}></td>
                      </tr>
                    )}

                    <tr>
                      <td>Авторы</td>
                      <td>{this.authorsList()}</td>
                    </tr>
                    {SeriesTitle && (
                      <tr>
                        <td>Серия</td>
                        <td>{this.seriesList()}</td>
                      </tr>
                    )}

                    <tr>
                      <td>Жанры</td>
                      <td>{Genres}</td>
                    </tr>
                    {LibRate > 0 && (
                      <tr>
                        <td>Рейтинг</td>
                        <td>{Array(LibRate * 1 + 1).join("☆")}</td>
                      </tr>
                    )}

                    <tr>
                      <td>Размер</td>
                      <td>
                        {BookSize > 1000 * 1000
                          ? `${(BookSize / 1024 / 1024).toFixed(1)} M`
                          : `${(BookSize / 1024).toFixed(1)} k`}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="text-center">
                        <div className="d-flex flex-column justify-content-start align-items-start p-2">
                          {publisher && <span className="">Издательство: {publisher}</span>}
                          {city && (
                            <span className="">
                              {" "}
                              {city} {year} г.
                            </span>
                          )}
                          {isbn && <span className="">ISBN: {isbn}</span>}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left">Скачать</td>
                      <td className="text-right">
                        <a
                          className="btn btn-sm btn-outline-warning pt-0 pb-0 mr-1 shadow"
                          href={`${this.props.apiData.apiData._baseUrl}Images/fb2/${BookID}`}
                        >
                          {Ext}
                        </a>
                        <a
                          className="btn btn-sm btn-outline-warning pt-0 pb-0 mr-1"
                          href={`${this.props.apiData.apiData._baseUrl}Images/zip/${BookID}`}
                        >
                          .zip
                        </a>
                        <a
                          className="btn btn-sm btn-outline-warning pt-0 pb-0 mr-1"
                          href={`${this.props.apiData.apiData._baseUrl}Images/fb2compact/${BookID}`}
                        >
                          {Ext} (только текст)
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </span>
    );

    if (this.props.selectedItemID === null) return <></>;

    return (
      <div>
        {maximazed ? (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              zIndex: 1,
            }}
            className="book-form"
          >
            {content}
          </div>
        ) : (
          <WithDragMotion>
            <div className={`book-form`}>{content}</div>
          </WithDragMotion>
        )}
      </div>
    );
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export default withErrorBoundary(BookForm);
