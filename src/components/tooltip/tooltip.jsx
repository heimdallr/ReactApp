import React, { useState } from "react";
import "./tooltip.css";

const Tooltip = (props) => {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    setActive(true);
    // timeout = setTimeout(() => {
    //   setActive(false);
    // }, props.delay || 5000);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className="Tooltip-Wrapper"
      // When to show the tooltip
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {/* Wrapping */}
      {props.children}
      {active && (
        <div className={`Tooltip-Tip ${props.direction || "top"} pt-0 pb-0`}>
          {/* Content */}
          {props.content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
