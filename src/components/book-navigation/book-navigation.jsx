import React from "react";
import "./book-navigation.css";

export default function BookNavigation({ navTags }) {
  const navigationLinks = () => {
    const navMenu = navTags.map((item, i) => (
      <div key={i}>
        <button
          onClick={() => {
            document.getElementById("scrollableDiv").getElementsByClassName("section")[item.sectionID].scrollIntoView();
          }}
          style={{ marginLeft: `${item.level}rem` }}
          className="btn btn-sm btn-outline-info pt-0 pb-0 mb-1"
        >
          {item.innerText}
        </button>
      </div>
    ));
    return navMenu;
  };
  return <div className="bookNavigation">{navigationLinks()}</div>;
}
