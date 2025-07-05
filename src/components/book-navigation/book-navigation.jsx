import React, { useEffect } from "react";
import "./book-navigation.css";

export default function BookNavigation({ navTags, BookID, handleClickNavigation }) {
  useEffect(() => {
    const el = document.getElementById("success");
    if (el)
      document.getElementById("success").scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
  }, []);
  const readerPosition = localStorage.getItem(BookID) * 1;
  const navigationLinks = () => {
    const navMenu = navTags.map((item, i) => {
      const id = item.sectionID;
      let bageColor = "info";
      if (readerPosition >= item.heightPercentSize) bageColor = "success";
      if (navTags[i + 1] !== undefined && readerPosition >= navTags[i + 1].heightPercentSize) bageColor = "secondary";
      return (
        <div key={i} id={bageColor}>
          <button
            onClick={() => {
              document.getElementById("scrollableDiv").getElementsByClassName("section")[id].scrollIntoView();
              handleClickNavigation();
            }}
            style={{ marginLeft: `${item.level}rem` }}
            className={`btn btn-sm btn${bageColor === "success" ? "" : "-outline"}-warning pt-0 pb-0 mb-1`}
          >
            {item.innerText}
            <span
              className={`badge badge-${bageColor} ml-2 mr-0 pr-1 align-center shadow text-dark border border-dark`}
            >{`${Number(item.heightPercentSize.toFixed(1))}%`}</span>
          </button>
        </div>
      );
    });
    return navMenu;
  };
  return <div className="bookNavigation">{navigationLinks()}</div>;
}
