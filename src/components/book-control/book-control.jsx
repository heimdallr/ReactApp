import React, { Component } from "react";
import "./book-control.css";
import BookNavigation from "../book-navigation/book-navigation";

export class BookControl extends Component {
  render() {
    const {
      BookID,
      autoScrollContent,
      scrollSpeed,
      maximazed,
      displayBookContent,
      Title,
      readerPosition,
      bookContentLoading,
      navTags,
    } = this.props;
    const readBook = (
      <span
        className="btn btn-sm read btn-outline-warning ml-3 mt-1 pt-0 pb-0 mr-auto align-self-baseline"
        onClick={this.props.handleBookContent}
      >
        Читать
        {readerPosition ? ` (${readerPosition.toFixed(2)}%)` : null}
      </span>
    );
    const bookIsLoading = (
      <span className="btn btn-sm loading btn-outline-info ml-3 mt-1 pt-0 pb-0 mr-auto align-self-baseline">
        Загрузка
        {readerPosition ? ` (${readerPosition.toFixed(2)}%)` : null}
      </span>
    );
    return (
      <div className="bookControl d-flex flex-row mb-1 justify-content-center form-header">
        {navTags.length > 0 && displayBookContent && <BookNavigation navTags={navTags} />}
        {displayBookContent ? (
          // Return Back to form
          <span
            className="btn btn-sm btn-outline-info ml-3 mt-1 pt-0 pb-0 mr-auto align-self-baseline"
            onClick={this.props.handleBookContent}
          >
            Назад
          </span>
        ) : (
          <>{bookContentLoading ? bookIsLoading : readBook}</>
        )}

        {/* Progress */}
        {displayBookContent ? (
          <span id="progress" className="text-warning p-0 pb-0 mt-1"></span>
        ) : (
          <div className="text-center h2 neon-text pl-3 pr-3 mr-1 ml-1">{Title}</div>
        )}
        <span className="ml-auto p-0 align-self-baseline mr-1 mt-1 align-self-baseline">
          {displayBookContent ? (
            <span>
              {/* AutoscrollContent */}
              <span className="mr-5">
                <span
                  title="Уменьшить скорость прокрутки: клавиша минус во время прокрутки текста"
                  className="bg-warning p-0 btn btn-sm text-dark align-self-baseline mr-1"
                  onClick={() => {
                    this.props.handleDecScrollSpeed();
                  }}
                >
                  ➖
                </span>
                <span
                  title="Автопрокрутка текста: Ins"
                  className={`bg-${
                    autoScrollContent ? "info" : "warning"
                  } pl-1 pr-1 pt-0 pb-0 btn btn-sm text-dark align-self-baseline mr-1`}
                  onClick={() => {
                    this.props.handleAutoScrollContent();
                  }}
                >
                  ⏭ {scrollSpeed}
                </span>
                <span
                  title="Увеличить скорость прокрутки: клавиша плюс во время прокрутки текста"
                  className="mr-1 bg-warning p-0 btn btn-sm text-dark align-self-baseline"
                  onClick={() => {
                    this.props.handleIncScrollSpeed();
                  }}
                >
                  ➕
                </span>
              </span>
              {/* Font size */}
              <span className="mr-5">
                <span
                  title="Уменьшить размер шрифта: клавиша минус"
                  className="bg-warning p-0 btn btn-sm text-dark align-self-baseline mr-1"
                  onClick={() => {
                    this.props.handleDecFormFontSize(BookID);
                  }}
                >
                  ➖
                </span>
                <span className="mr-1">👀</span>
                <span
                  title="Увеличить размер шрифта: клавиша плюс"
                  className="mr-1 bg-warning p-0 btn btn-sm text-dark align-self-baseline"
                  onClick={() => {
                    this.props.handleIncFormFontSize(BookID);
                  }}
                >
                  ➕
                </span>
              </span>
              {/* Max Min */}
              <span
                title="Enter"
                className="mr-3 bg-warning p-0 btn btn-sm text-dark"
                onClick={() => {
                  this.props.handleMaximazeBookContent(BookID);
                }}
              >
                {maximazed ? "📜" : "📖"}
              </span>
            </span>
          ) : null}
          <span
            title="Закрыть: Esc"
            className="bg-info p-0 btn btn-sm"
            onClick={() => {
              this.props.handleSelectItem(null);
            }}
          >
            ❌
          </span>
        </span>
      </div>
    );
  }
}

export default BookControl;
