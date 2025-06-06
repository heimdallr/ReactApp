import { useEffect, useState, useRef } from "react";
import "./book-content.css";
import Spinner from "../spinner";
import { XMLParser } from "fast-xml-parser";

//XML Parser
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
  "<div class='h2 title text-center pt-0'>",
  "</div>",
  "<div class='card section text-dark mb-3 p-1 m-1  shadow'>",
  "</div>",
  "<br/>",
  "<div class='poem card alert-secondary text-dark ml-auto mr-auto mt-2 mb-2 pl-1 pr-1 shadow col-auto'>",
  "</div>",
  "<div class='stanza card card-body bg-light text-dark ml-auto mr-auto mt-1 mb-1 pt-1 pb-1 pl-1 pr-1 shadow col-auto'>",
  "</div>",
  "<div class='v font-italic'>",
  "</div>",
  "<span class='emphasis text-primary p-0 font-italic'>",
  "</span>",
  "<div class='epigraph font-italic alert-dark col-auto ml-auto mt-3 pt-1 pb-1 mb-3 shadow'>",
  "</div>",
  "<div class=' subtitle text-center col-auto ml-auto mr-auto pt-0'>",
  "</div>",
  "<div class='cite text-center col-auto ml-auto mr-auto pt-0'>",
  "</div>",
  "<span class='text-author ml-auto mr-auto mt-1 mb-1 p-1 col-auto font-italic'>",
  "</span>",
];

function BookContent({ BookID, apiData }) {
  const [isLoading, setIsLoading] = useState(true);
  const [body, setBody] = useState(""); //Книга
  const scrollableDivRef = useRef(null);

  useEffect(() => {
    getRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BookID]);

  useEffect(() => {
    if (scrollableDivRef.current) {
      const scrollableDiv = document.getElementById("scrollableDiv");
      const progress = document.getElementById("progress");
      scrollableDiv.addEventListener("scroll", () => {
        const scrollPercent =
          (scrollableDiv.scrollTop / (scrollableDiv.scrollHeight - scrollableDiv.clientHeight)) * 100;
        progress.innerHTML = scrollPercent
          ? `<span className="col-auto btn btn-sm btn-secondary mt-1 pt-0 pb-0">${scrollPercent.toFixed(3)}%</span>`
          : "";
        localStorage.setItem(BookID, scrollPercent);
      });
    }
  }, [BookID]);

  useEffect(() => {
    if (body && scrollableDivRef.current) {
      const scrollableDiv = document.getElementById("scrollableDiv");
      scrollableDiv.scrollTo(
        0,
        (localStorage.getItem(BookID) * (scrollableDiv.scrollHeight - scrollableDiv.clientHeight)) / 100
      );
    }
  }, [body, BookID]);

  async function getRecord() {
    let binary = null;
    let text = null;
    let bodyNotes = null;
    try {
      const res = await apiData.getBook({ BookID });
      text = res.slice(res.indexOf("<body>"), res.lastIndexOf("</body>") + 7);
      text = replaceAllText(text, searchTerms, replacements);
      if (res.indexOf("<binary")) {
        binary = parser.parse(res.slice(res.indexOf("<binary"), res.indexOf("</FictionBook>")));
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
      if (res.indexOf('<body name="notes">')) {
        bodyNotes = parser.parse(res.slice(res.indexOf('<body name="notes">'), res.lastIndexOf("</body>") + 7));
        if (bodyNotes.body && Array.isArray(bodyNotes.body.section)) {
          bodyNotes.body.section.map(function (item) {
            const regex = new RegExp('<a (.+):href="#' + item["@_id"] + '(.+)">', "g");
            if (text.match(regex)) {
              text = text.replaceAll(
                regex,
                `<a ${typeof item["p"] === "string" ? `title="${item["p"]}"` : ""} href="#${item["@_id"]}">`
              );
            }
            // console.log(builder.build(item["p"]));
          });

          //  <a type="note" l:href="#note_1">[1]</a>
        }
        // console.log(bodyNotes.body);
      }
      if (text) {
        setBody(text);
      } else {
        setBody("Книга не найдена");
      }
      //   setBody(text);
      //   if (res.indexOf('<body name="notes">'))
      // setbodyNotes(res.slice(res.indexOf('<body name="notes">'), res.lastIndexOf("</body>") + 7));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  //   console.log(progress);

  return (
    <>
      {isLoading ? <Spinner /> : null}

      {/* <div className="book-content">
        <pre className="card">{body}</pre>
      </div> */}
      <>
        <div
          id="scrollableDiv"
          //   style={{ position: "sticky", top: 0, width: `${progress}%`, height: "5px", backgroundColor: "blue" }}
          className="book-content"
          dangerouslySetInnerHTML={{ __html: body }}
          ref={scrollableDivRef}
        ></div>
      </>
    </>
  );
}

export default BookContent;

//
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
