import React from "react";
import "./error-indicator.css";

const ErrorIndicator = ({ message }) => {
  return (
    <div className="error-indicator">
      <div className="card bg-dark shadow text-center d-flex">
        <h1>😢</h1>
        <h4
          style={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
            fontSize: "80%",
          }}
        >
          {message}
        </h4>
      </div>
    </div>
  );
};

export default ErrorIndicator;

ErrorIndicator.defaultProps = {
  message: "Что-то пошло не так",
};
