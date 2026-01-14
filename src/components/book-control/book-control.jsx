import React, { Component } from "react";
import "./book-control.css";
import BookNavigation from "../book-navigation/book-navigation";

export class BookControl extends Component {
  state = {
    contentsTableSelected: true,
  };

  handleNavigationHoover = () => {
    this.setState({ contentsTableSelected: true });
  };
  render() {
    const {
      autoScrollContent,
      scrollSpeed,
      maximazed,
      displayBookContent,
      Title,
      readerPosition,
      bookContentLoading,
      navTags,
      FileName,
    } = this.props;

    const readBook = (
      <span
        className="btn btn-sm read btn-outline-warning ml-2 mt-1 pt-0 pb-0 mr-auto align-self-baseline"
        onClick={this.props.handleBookContent}
      >
        Читать
        {readerPosition ? ` (${readerPosition.toFixed(2)}%)` : null}
      </span>
    );
    const bookIsLoading = (
      <span className="btn btn-sm loading btn-outline-info ml-2 mt-1 pt-0 pb-0 mr-auto align-self-baseline">
        Загрузка
        {readerPosition ? ` (${readerPosition.toFixed(2)}%)` : null}
      </span>
    );
    return (
      <div className="bookControl d-flex flex-row mb-1 justify-content-center form-header">
        {displayBookContent ? (
          // Return Back to form
          <>
            <span
              className="btn btn-sm btn-outline-info ml-1 mt-1 pt-0 pb-0  align-self-baseline"
              onClick={this.props.handleBookContent}
            >
              «
            </span>
            <span
              className="navigate mr-1 align-self-baseline btn btn-sm btn-outline-info ml-1 mt-1 pt-0 pb-0"
              onMouseEnter={() => {
                this.handleNavigationHoover();
              }}
            >
              Навигация
              {navTags.length > 0 && displayBookContent && (
                <BookNavigation navTags={navTags} FileName={FileName} readerPosition={readerPosition} />
              )}
            </span>

            <span className="ml-auto p-0 align-self-baseline mr-1 mt-1">
              <span id="progress" className=""></span>
              {/* AutoscrollContent */}
              <span className="mr-1">
                <span
                  title="Уменьшить скорость прокрутки: клавиша минус во время прокрутки текста"
                  className="btn-info p-0 btn btn-sm text-dark align-self-baseline mr-1"
                  onClick={() => {
                    this.props.handleDecScrollSpeed();
                  }}
                >
                  ➖
                </span>
                <span
                  title="Автопрокрутка текста: Ins"
                  className={`btn-${
                    autoScrollContent ? "info" : "outline-info"
                  } pl-1 pr-1 pt-0 pb-0 btn btn-sm text-light align-self-baseline mr-1`}
                  onClick={() => {
                    this.props.handleAutoScrollContent();
                  }}
                >
                  ⏭ {scrollSpeed}
                </span>
                <span
                  title="Увеличить скорость прокрутки: клавиша плюс во время прокрутки текста"
                  className="mr-1 btn-info p-0 btn btn-sm text-dark align-self-baseline"
                  onClick={() => {
                    this.props.handleIncScrollSpeed();
                  }}
                >
                  ➕
                </span>
              </span>
              {/* Font size */}
              <span className="mr-1">
                <span
                  title="Уменьшить размер шрифта: клавиша минус"
                  className="btn-info p-0 btn btn-sm text-dark align-self-baseline mr-1"
                  onClick={() => {
                    this.props.handleDecFormFontSize();
                  }}
                >
                  ➖
                </span>
                <span className="mr-1">👀</span>
                <span
                  title="Увеличить размер шрифта: клавиша плюс"
                  className="mr-1 btn-info p-0 btn btn-sm text-dark align-self-baseline"
                  onClick={() => {
                    this.props.handleIncFormFontSize();
                  }}
                >
                  ➕
                </span>
              </span>
              {/* Max Min */}
              <span
                title="Enter"
                className="mr-1 bg-info p-0 btn btn-sm text-dark"
                onClick={() => {
                  this.props.handleMaximazeBookContent();
                }}
              >
                {maximazed ? "📜" : "📖"}
              </span>
            </span>
          </>
        ) : (
          <>
            {bookContentLoading ? bookIsLoading : readBook}
            <div className="text-center h2 neon-text pl-3 pr-3 mr-1 ml-1">{Title}</div>
          </>
        )}

        {/* Progress */}
        {/* {displayBookContent ? <></> : } */}

        {displayBookContent ? <></> : null}
        <span
          title="Закрыть: Esc"
          className="bg-info p-0 btn btn-sm align-self-baseline mr-1 mt-1"
          onClick={() => {
            this.props.handleSelectItem(null);
          }}
        >
          ❌
        </span>
      </div>
    );
  }
}

export default BookControl;
