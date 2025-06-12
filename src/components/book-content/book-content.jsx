import { useEffect, useState, useRef } from "react";
import "./book-content.css";
import Spinner from "../spinner";
import { XMLParser } from "fast-xml-parser";

//XML Parser + options
const options = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
};
const parser = new XMLParser(options);

//XML Replace data
const searchTerms = [
  "<body>",
  "</body>",
  "<title>",
  "</title>",
  "<section>",
  "</section>",
  "<empty-line/>",
  "<poem>",
  "</poem>",
  "<stanza>",
  "</stanza>",
  "<v>",
  "</v>",
  "<emphasis>",
  "</emphasis>",
  "<epigraph>",
  "</epigraph>",
  "<subtitle>",
  "</subtitle>",
  "<cite>",
  "</cite>",
  "<text-author>",
  "</text-author>",
];
const replacements = [
  "<div>",
  "</div>",
  "<div class='title text-center p-0 m-0'>",
  "</div>",
  "<div class='card section text-dark mb-3 p-1 m-1 shadow'>",
  "</div>",
  "<br/>",
  "<div class='poem card alert-secondary text-dark ml-auto mr-auto mt-2 mb-2 pl-1 pr-1 shadow col-auto'>",
  "</div>",
  "<div class='stanza card card-body text-dark ml-auto mr-auto mt-1 mb-1 pt-1 pb-1 pl-1 pr-1 shadow col-auto'>",
  "</div>",
  "<div class='v font-italic'>",
  "</div>",
  "<span class='emphasis text-primary p-0 font-italic'>",
  "</span>",
  "<div class='epigraph font-italic alert-dark col-auto ml-auto mt-3 pt-1 pb-1 mb-3 shadow'>",
  "</div>",
  "<div class='subtitle text-center col-auto ml-auto mr-auto pt-0'>",
  "</div>",
  "<div class='cite text-center col-auto ml-auto mr-auto pt-0'>",
  "</div>",
  "<span class='text-author ml-auto mr-auto mt-1 mb-1 p-1 col-auto font-italic'>",
  "</span>",
];

function BookContent({ BookID, maximazed, bookContent, formFontSize, autoScrollContent, scrollSpeed }) {
  const [isLoading, setIsLoading] = useState(true);
  const [body, setBody] = useState(""); //Prepared book content
  const scrollableDivRef = useRef(null); //Ref to book content div

  //Start's disassembling book content when received
  useEffect(() => {
    getRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookContent]);

  //Display scroll progress on scroll event
  useEffect(() => {
    if (scrollableDivRef.current) {
      const scrollableDiv = document.getElementById("scrollableDiv");
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
  }, [body, BookID, maximazed, formFontSize]);

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

  async function getRecord() {
    let binary = null;
    let text = null;
    let bodyNotes = null;
    try {
      text = bookContent.slice(bookContent.indexOf("<body>"), bookContent.lastIndexOf("</body>") + 7);
      text = replaceAllText(text, searchTerms, replacements);
      if (bookContent.indexOf("<binary")) {
        binary = parser.parse(bookContent.slice(bookContent.indexOf("<binary"), bookContent.indexOf("</FictionBook>")));
        if (Array.isArray(binary.binary)) {
          binary.binary.map(function (item) {
            const regex = new RegExp('<image (.+):href="#' + item["@_id"] + '"/>', "g");
            if (text.match(regex)) {
              text = text.replaceAll(
                regex,
                `<div class="text-center ml-auto mr-auto shadow col-auto mb-2"><img class="shadow m-2" src="data:image/png;base64, ${item["#text"]}" alt="Red dot"/></div>`
              );
            }
          });
        }
      }
      if (bookContent.indexOf('<body name="notes">')) {
        bodyNotes = parser.parse(
          bookContent.slice(bookContent.indexOf('<body name="notes">'), bookContent.lastIndexOf("</body>") + 7)
        );
        if (bodyNotes.body && Array.isArray(bodyNotes.body.section)) {
          bodyNotes.body.section.map(function (item) {
            const regex = new RegExp('<a (.+):href="#' + item["@_id"] + '(.+)">', "g");
            if (text.match(regex)) {
              text = text.replaceAll(
                regex,
                `<a ${typeof item["p"] === "string" ? `title="${item["p"]}"` : ""} href="#${item["@_id"]}">`
              );
            }
          });
        }
      }
      if (text) {
        setBody(text);
      } else {
        setBody("Книга не найдена");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading ? <Spinner /> : null}

      {/* Just for look inside fb2 */}
      {/* <div className="book-content">
        <pre className="card">{body}</pre>
      </div> */}
      <div
        style={{ fontSize: `${formFontSize}em` }}
        id="scrollableDiv"
        className={`book-content ${maximazed ? "maxContent" : "pageContent"}`}
        dangerouslySetInnerHTML={{ __html: body }}
        ref={scrollableDivRef}
      ></div>
    </>
  );
}

export default BookContent;

function replaceAllText(text, searchTerms, replacements) {
  if (searchTerms.length !== replacements.length) {
    throw new Error("Search and replacement arrays must have the same length.");
  }

  let updatedText = text;
  for (let i = 0; i < searchTerms.length; i++) {
    const searchTerm = searchTerms[i];
    const replacement = replacements[i];
    updatedText = updatedText.replaceAll(searchTerm, replacement);
  }
  return updatedText;
}
