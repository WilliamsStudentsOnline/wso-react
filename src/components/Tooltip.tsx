import React from "react";
import "./stylesheets/Tooltip.css";

const Tooltip = ({ message }: { message: string }) => {
  return (
    <div className="tooltip">
      <span className="icon">i</span>
      <span className="tooltiptext">{message}</span>
    </div>
  );
};

export default Tooltip;
