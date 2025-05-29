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
          scope === scopeID ? "warning font-weight-bold text-dark" : "dark text-light "
        } ml-3 pt-0 pb-0 shadow`}
      >
        <b>{scopeName}:</b> {scopeWarning}
      </button>
    </>
  );
}

export default ScopeSelector;
