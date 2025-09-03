import { useEffect, useState } from "react";
import "./book-content.css";
import fb2Parser from "../../xml-helpers/fb2-parser";
import BookContentBody from "../book-content-body/book-content-body";

function BookContent({
  maximazed,
  bookContent,
  formFontSize,
  autoScrollContent,
  scrollSpeed,
  handleAutoScrollContent,
  handleNavTags,
  FileName,
}) {
  const [body, setBody] = useState(""); //Prepared book content
  //Parse fb2
  useEffect(() => {
    const body = fb2Parser(bookContent);
    setBody(body);
  }, [bookContent]);

  //Display scroll progress and update on scroll event
  useEffect(() => {
    const scrollableDiv = document.getElementById("scrollableDiv");
    if (scrollableDiv) {
      const progress = document.getElementById("progress");

      scrollableDiv.addEventListener(
        "scroll",
        () => {
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
          localStorage.setItem(FileName, scrollPercent);
        },
        { passive: true }
      );
    }
  }, [FileName, scrollSpeed, autoScrollContent]);

  //Maximize || Minimize content
  useEffect(() => {
    const scrollableDiv = document.getElementById("scrollableDiv");
    if (body && scrollableDiv) {
      if (localStorage.getItem("currentObject")) {
        const currentObject = localStorage.getItem("currentObject");
        const currentObjectPosition = localStorage.getItem("currentObjectPosition");

        const elCollection = scrollableDiv.getElementsByTagName("p");
        const { top: elTop } = elCollection[currentObject].getBoundingClientRect();

        scrollableDiv.scrollTo(
          0,
          scrollableDiv.scrollTop + elTop - currentObjectPosition - scrollableDiv.getBoundingClientRect().top
        );
        localStorage.removeItem("currentObject");
        localStorage.removeItem("currentObjectPosition");
      } else {
        scrollableDiv.scrollTo(
          0,
          (localStorage.getItem(FileName) * (scrollableDiv.scrollHeight - scrollableDiv.clientHeight)) / 100
        );
      }
    }
  }, [body, FileName, maximazed, formFontSize]);

  // Scroll content
  useEffect(() => {
    let interval = null;
    const scrollableDiv = document.getElementById("scrollableDiv");
    if (body && scrollableDiv) {
      if (autoScrollContent) {
        interval = setInterval(function () {
          scrollableDiv.scrollTo(0, ++scrollableDiv.scrollTop);
        }, (1 * 100) / scrollSpeed);
      } else {
        clearInterval(interval);
      }
    }
    return () => {
      clearInterval(interval);
    };
  }, [scrollSpeed, body, autoScrollContent]);

  useEffect(() => {
    const scrollableDiv = document.getElementById("scrollableDiv");
    if (scrollableDiv && body) {
      const sections = scrollableDiv.getElementsByClassName("section");
      const navArray = [];
      const { height, top } = scrollableDiv.firstElementChild.getBoundingClientRect();
      //get sections info
      if (sections) {
        let counter = 0;
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].getElementsByClassName("title").length) {
            if (sections[i].getElementsByClassName("title")[0].innerText) {
              navArray[counter] = {
                innerText: sections[i].getElementsByClassName("title")[0].innerText,
                level: 0,
                sectionID: i,
                size: sections[i].getBoundingClientRect().height,
                heightPercentSize:
                  ((sections[i].getBoundingClientRect().top - top - scrollableDiv.clientHeight / 2) /
                    (height - scrollableDiv.clientHeight)) *
                  100,
                sectionHeightPercentSize: (sections[i].getBoundingClientRect().height / height) * 100,
              };
              counter++;
            }
          }
        }
      }
      //leveling sections
      for (let i = 0; i < navArray.length; i++) {
        for (let j = 0; j < navArray.length; j++) {
          if (i !== j && sections[navArray[i].sectionID].contains(sections[navArray[j].sectionID])) {
            navArray[j].level = navArray[i].level + 1;
          }
        }
      }
      handleNavTags(navArray);
    }
  }, [body, handleNavTags]);

  return (
    <>
      <div
        id="scrollableDiv"
        className={`book-content ${maximazed ? "maxContent" : "pageContent"}`}
        onClick={(e) => {
          if (maximazed) {
            e.preventDefault();
            if (autoScrollContent) {
              handleAutoScrollContent();
            } else {
              const scrollableDiv = document.getElementById("scrollableDiv");
              scrollableDiv.scrollTo(0, scrollableDiv.clientHeight + scrollableDiv.scrollTop - 30);
            }
          }
        }}
      >
        <BookContentBody body={body} formFontSize={formFontSize} />
      </div>
    </>
  );
}

export default BookContent;
