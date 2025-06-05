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
  };
  componentDidMount() {
    this.getRecord();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedItemID !== this.props.selectedItemID) {
      this.setState({ loading: true, bookForm: {} });
      this.getRecord();
    }
  }

  getRecord = () => {
    this.setState({ loading: true });
    const { selectedItemID } = this.props;
    this.props.apiData.getBookForm({ selectedItemID }).then((res) => this.setState({ ...res, loading: false }));
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
    }));
  };

  render() {
    const { BookID, Title, SeriesTitle, SeqNumber, LibRate, FileName, BookSize, Genres, Ext } = this.state.bookForm;
    const { annotation, publisher, city, year, isbn } = this.state;

    const content = this.state.loading ? (
      <Spinner />
    ) : (
      <span className="card bg-dark shadow border border-info rounded-lg">
        {/* <div className="" onPointerDownCapture={(e) => e.stopPropagation()}> */}
        <div className="d-flex flex-row mb-1 justify-content-center">
          {this.state.displayBookContent ? (
            <span className="btn  btn-sm btn-warning ml-3 mt-1 pt-0 pb-0 mr-auto" onClick={this.handleBookContent}>
              Назад
            </span>
          ) : null}
          <span id="progress"></span>
          <span
            className="ml-auto p-0 hover-zoom bg-info"
            onClick={() => {
              this.props.handleSelectItem(null);
            }}
          >
            ❌
          </span>
        </div>
        {this.state.displayBookContent ? (
          <BookContent handleBookContent={this.handleBookContent} apiData={this.props.apiData} BookID={BookID} />
        ) : (
          <>
            <div className="text-center h2 neon-text pl-3 pr-3 mr-3">{Title}</div>
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
                  <tr>
                    <td>
                      <span className="btn btn-sm btn-outline-warning pt-0 pb-0 mr-1">Читать</span>
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
      <div className="">
        <WithDragMotion>
          <div className="book-form">{content}</div>
        </WithDragMotion>
      </div>
    );
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export default withErrorBoundary(BookForm);
