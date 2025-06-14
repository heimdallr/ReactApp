import React, { Component } from "react";
import "./book-description.css";

export class BookDescription extends Component {
  render() {
    const {
      bookForm: { BookID, SeriesTitle, LibRate, FileName, BookSize, Genres, Ext },
      annotation,
      publisher,
      city,
      year,
      isbn,
      _baseUrl,
    } = this.props;
    return (
      <div className="d-flex align-items-center justify-content-center">
        <table className="table-dark table-striped text-left" onClick={this.props.handleBookContent}>
          <tbody>
            <tr>
              <td className="hover-image-scale p-0">
                {FileName && (
                  <img className="coverImage" src={`${_baseUrl}Images/covers/${BookID}`} alt={`Cover  ${FileName}`} />
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
                <td>{this.props.authorsList()}</td>
              </tr>
              {SeriesTitle && (
                <tr>
                  <td>Серия</td>
                  <td>{this.props.seriesList()}</td>
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
                    href={`${_baseUrl}Images/fb2/${BookID}`}
                  >
                    {Ext}
                  </a>
                  <a className="btn btn-sm btn-outline-warning pt-0 pb-0 mr-1" href={`${_baseUrl}Images/zip/${BookID}`}>
                    .zip
                  </a>
                  <a
                    className="btn btn-sm btn-outline-warning pt-0 pb-0 mr-1"
                    href={`${_baseUrl}Images/fb2compact/${BookID}`}
                  >
                    {Ext} (только текст)
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default BookDescription;
