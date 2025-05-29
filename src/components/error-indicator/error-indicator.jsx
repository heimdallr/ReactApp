import React from "react";
import "./error-indicator.css";

const ErrorIndicator = ({ message }) => {
  return (
    <div className="error-indicator">
      <div className="card shadow text-center d-flex">
        <img
          style={{ width: "100px", marginLeft: "auto", marginRight: "auto" }}
          src="/img/error.png"
          alt="errorImage"
        />
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
