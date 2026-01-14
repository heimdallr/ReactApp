import React from "react";
import { XMLParser } from "fast-xml-parser";
import nodeReplace from "../node-replace";

//XML Parser + options
const options = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
};
const parser = new XMLParser(options);

function fb2Parser(bookContent) {
  let binary = null;
  let text = null;
  let bodyNotes = null;
  try {
    text = bookContent.slice(bookContent.indexOf("<body"), bookContent.lastIndexOf("</body>") + 7);

    text = nodeReplace(text);
    if (bookContent.indexOf("<binary")) {
      binary = parser.parse(bookContent.slice(bookContent.indexOf("<binary"), bookContent.indexOf("</FictionBook>")));
      if (Array.isArray(binary.binary)) {
        binary.binary.map(function (item) {
          const regex = new RegExp('<image (.):href="#' + item["@_id"] + '"/>', "g");
          if (text.match(regex)) {
            text = text.replaceAll(
              regex,
              `<div class="text-center image ml-auto mr-auto col-auto p-0"><img src="data:image/png;base64, ${item["#text"]}" alt="img"/></div>`
            );
          }
        });
      }
    }

    if (bookContent.indexOf('<body name="notes">')) {
      if (bookContent.includes('<body name="notes">')) {
        const notes = bookContent.slice(
          bookContent.indexOf('<body name="notes">'),
          bookContent.lastIndexOf("</body>") + 7
        );
        // const regex = new RegExp('(.):href="#', "g");
        // text = text.replaceAll(regex, ' href="#');

        bodyNotes = parser.parse(notes);
        if (bodyNotes.body && Array.isArray(bodyNotes.body.section)) {
          bodyNotes.body.section.map((item) => {
            const regex = new RegExp('<a( type="note")?( (.):href="#' + item["@_id"] + '"){1}( type="note")?>', "g");
            // if (text.match(regex)) {
            text = text.replace(
              regex,
              `<a ${
                typeof item["p"] === "string"
                  ? `title="${item["p"]}"`
                  : `title="${item["p"] !== undefined && item["p"]["#text"] !== undefined ? item["p"]["#text"] : ""}"`
              } href="#${item["@_id"]}">`
            );
            // }
          });
        }
      }
    }
    if (text) {
      return text;
    } else {
      return "Книга не найдена";
    }
  } catch (error) {
    console.log(error);
  }
}

export default fb2Parser;
