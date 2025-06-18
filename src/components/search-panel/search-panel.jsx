import "./search-panel.css";
import React, { Component } from "react";

export default class SearchPanel extends Component {
  render() {
    const { search, onSearchChange, onFocus = () => {} } = this.props;
    const textFieldLength = search && search.length > 15 ? search.length : 15;
    const textStyle = { width: `${textFieldLength + 2}ch`, maxWidth: window.innerWidth * 0.9 }; //Авторазмер поля
    return (
      <div className="search-panel mr-auto p-0">
        <input
          style={textStyle}
          className="form-control-sm"
          name="label"
          placeholder="Поиск книг"
          onChange={onSearchChange}
          onFocus={onFocus}
          value={search}
        />
      </div>
    );
  }
}
