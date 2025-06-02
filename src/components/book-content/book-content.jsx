import { useEffect, useState } from "react";
import "./book-content.css";
import Spinner from "../spinner";
import { XMLParser } from "fast-xml-parser";

const options = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
};
const parser = new XMLParser(options);

function BookContent({ BookID, apiData }) {
  const [isLoading, setIsLoading] = useState(true);
  const [body, setBody] = useState(""); //Книга
  //   const [description, setDescription] = useState(""); //Описание
  const [binary, setBinary] = useState(null); //Изображения
  //   const [bodyNotes, setbodyNotes] = useState(""); //Заметки

  async function getRecord() {
    try {
      const res = await apiData.getBook({ BookID });
      //   setDescription(res.slice(res.indexOf("<description>"), res.indexOf("</description>") + 14));
      setBody(res.slice(res.indexOf("<body>"), res.indexOf("</body>") + 7));
      //   if (res.indexOf('<body name="notes">'))
      // setbodyNotes(res.slice(res.indexOf('<body name="notes">'), res.lastIndexOf("</body>") + 7));
      if (res.indexOf("<binary"))
        setBinary(parser.parse(res.slice(res.indexOf("<binary"), res.indexOf("</FictionBook>"))));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BookID]);

  const searchTerms = ["<body>", "</body>", "<title>", "</title>", "<section>", "</section>", "<empty-line/>"];
  const replacements = [
    "<div>",
    "</div>",
    "<div class='h2 ml-3'>",
    "</div>",
    "<div class='card card-body text-dark mb-3 p-2  shadow'>",
    "</div>",
    "<br/>",
  ];
  let newText = replaceAllText(body, searchTerms, replacements);

  if (binary && Array.isArray(binary.binary)) {
    binary.binary.map(function (item) {
      if (newText.match('<image l:href="#' + item["@_id"] + '"/>', "g")) {
        newText = newText.replaceAll(
          `<image l:href="#${item["@_id"]}"/>`,
          `<div class="text-center"><img src="data:image/png;base64, ${item["#text"]}" alt="Red dot"/></div>`
        );
      }
    });
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        // Исходный html
        // <div className="book-content">
        //   <pre className="card">{newText}</pre>
        // </div>
        <div className="book-content" dangerouslySetInnerHTML={{ __html: newText }}></div>
      )}
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
