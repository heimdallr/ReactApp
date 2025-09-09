import React from "react";

function nodeReplace(text) {
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
    "<div class='card section text-dark p-1 m-1'>",
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
    "<div class='cite col-auto '>",
    "</div>",
    "<span class='text-author ml-auto mr-auto mt-1 mb-1 p-1 col-auto font-italic'>",
    "</span>",
  ];

  if (searchTerms.length !== replacements.length) {
    throw new Error("Search and replacement arrays must have the same length.");
  }
  let updatedText = text;
  for (let i = 0; i < searchTerms.length; i++) {
    const searchTerm = searchTerms[i];
    const replacement = replacements[i];

    // var re = new RegExp(`${searchTerm}[.]*[>]`, "g");
    updatedText = updatedText.replaceAll(searchTerm, replacement);
  }
  return updatedText;
}

export default nodeReplace;
