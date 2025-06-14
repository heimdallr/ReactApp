import { useEffect, useState, useRef } from "react";
import "./book-content.css";
import fb2Parser from "../../xml-helpers/fb2-parser";

function BookContent({ BookID, maximazed, bookContent, formFontSize, autoScrollContent, scrollSpeed }) {
  const [body, setBody] = useState(""); //Prepared book content
  const scrollableDivRef = useRef(null); //Ref to book content div

  //Parse fb2
  useEffect(() => {
    setBody(fb2Parser(bookContent));
  }, [bookContent]);

  //Display scroll progress and update on scroll event
  useEffect(() => {
    if (scrollableDivRef.current) {
      const scrollableDiv = scrollableDivRef.current;
      const progress = document.getElementById("progress");
      scrollableDiv.addEventListener("scroll", () => {
        const totalSeconds =
          (scrollableDiv.scrollHeight - scrollableDiv.scrollTop - scrollableDiv.clientHeight) / (scrollSpeed * 10);
        let date = new Date(1970, 0, 0, 0, 0, +totalSeconds || 0);
        const scrollPercent =
          (scrollableDiv.scrollTop / (scrollableDiv.scrollHeight - scrollableDiv.clientHeight)) * 100;
        progress.innerHTML = scrollPercent
          ? `${autoScrollContent ? `🐾` : ""} ${scrollPercent.toFixed(3)}% ${
              autoScrollContent
                ? `🐾  <span class="ml-5">${Math.floor(totalSeconds / 3600 / 24) || ""} ${
                    Math.floor(totalSeconds / 3600 / 24) ? "д." : ""
                  }   ${date.toLocaleTimeString()}</span>`
                : ""
            }`
          : "";
        localStorage.setItem(BookID, scrollPercent);
      });
    }
  }, [BookID, scrollSpeed, autoScrollContent]);

  //Maximize || Minimize content
  useEffect(() => {
    if (body && scrollableDivRef.current) {
      const scrollableDiv = document.getElementById("scrollableDiv");
      if (localStorage.getItem("currentPosition")) {
        const scrollPosition = localStorage.getItem("currentPosition");
        scrollableDiv.scrollTo(0, (scrollPosition * (scrollableDiv.scrollHeight - scrollableDiv.clientHeight)) / 100);
        localStorage.removeItem("currentPosition");
      } else {
        scrollableDiv.scrollTo(
          0,
          (localStorage.getItem(BookID) * (scrollableDiv.scrollHeight - scrollableDiv.clientHeight)) / 100
        );
      }
    }
  }, [body, BookID, maximazed]);

  // Scroll content
  useEffect(() => {
    let interval = null;
    if (body && scrollableDivRef.current) {
      const scrollableDiv = document.getElementById("scrollableDiv");
      if (autoScrollContent) {
        interval = setInterval(function () {
          scrollableDiv.scrollTop++;
        }, (1 * 100) / scrollSpeed);
      } else {
        clearInterval(interval);
      }
    }
    return () => {
      clearInterval(interval);
    };
  }, [scrollSpeed, body, autoScrollContent]);

  return (
    <div
      style={{ fontSize: `${formFontSize}em` }}
      id="scrollableDiv"
      className={`book-content ${maximazed ? "maxContent" : "pageContent"}`}
      dangerouslySetInnerHTML={{ __html: body }}
      ref={scrollableDivRef}
    ></div>
  );
}

export default BookContent;
