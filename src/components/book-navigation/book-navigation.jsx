import React, { useEffect } from "react";
import "./book-navigation.css";

export default function BookNavigation({ navTags, FileName, handleClickNavigation }) {
  useEffect(() => {
    const el = document.getElementById("info");
    if (el)
      document.getElementById("info").scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
  }, []);
  const readerPosition = localStorage.getItem(FileName) * 1;
  const navigationLinks = () => {
    const navMenu = navTags.map((item, i) => {
      const id = item.sectionID;
      let bageColor = "light";
      if (readerPosition >= item.heightPercentSize) bageColor = "info";
      if (navTags[i + 1] !== undefined && readerPosition >= navTags[i + 1].heightPercentSize) bageColor = "secondary";
      let itemColor = "success";
      if (item.level > 0) itemColor = "primary";
      if (item.level > 1) itemColor = "warning";
      if (item.level > 2) itemColor = "secondary";
      if (item.level > 3) itemColor = "light";
      return (
        <div key={i} id={bageColor} className="row p-0 m-0">
          {bageColor === "info" && (
            <span style={{ marginLeft: `${item.level * 1.5 - 0.7}rem`, position: "absolute" }}>✔️</span>
          )}
          <button
            onClick={() => {
              document.getElementById("scrollableDiv").getElementsByClassName("section")[id].scrollIntoView();
              handleClickNavigation();
            }}
            style={{
              marginLeft: `${item.level * 1.5}rem`,
              fontWeight: `${bageColor === "info" ? "bold" : "normal"}`,
            }}
            className={`btn btn-sm alert-${itemColor} pt-0 pb-0 mb-1 d-flex text-left align-items-center`}
          >
            {item.innerText}
            {bageColor === "info" ? (
              ""
            ) : (
              <span className={`badge badge-${bageColor} ml-2 mr-0 pr-1 align-center shadow border border-dark`}>
                {`${Number(item.heightPercentSize.toFixed(1))}%`}
              </span>
            )}
          </button>
        </div>
      );
    });
    return navMenu;
  };
  return <div className="bookNavigation">{navigationLinks()}</div>;
}
