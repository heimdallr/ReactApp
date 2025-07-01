import "./scope-selector.css";
import React from "react";

function ScopeSelector({ handleScopeSelection, scopeID, scopeName, scopeQuantity, scope }) {
  const scopeWarning =
    scopeQuantity > 3000 ? (
      <span className="text-danger"> {`> 3000 (${scopeQuantity})`}</span>
    ) : (
      <span> {scopeQuantity}</span>
    );
  return (
    <>
      <button
        onClick={() => {
          handleScopeSelection(scopeID);
        }}
        className={`btn btn-${
          scope === scopeID ? "warning text-dark" : "dark text-light "
        } ml-1 mr-1 pl-2 pr-2 pt-0 pb-0 shadow`}
      >
        <b>{scopeName}:</b> {scopeWarning}
      </button>
    </>
  );
}

export default ScopeSelector;
