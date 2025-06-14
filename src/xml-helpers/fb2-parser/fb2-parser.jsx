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
    text = bookContent.slice(bookContent.indexOf("<body>"), bookContent.lastIndexOf("</body>") + 7);
    // text = replaceAllText(text, searchTerms, replacements);
    text = nodeReplace(text);
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
      return text;
    } else {
      return "Книга не найдена";
    }
  } catch (error) {
    console.log(error);
  }
}

export default fb2Parser;
