// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../stylesheets/Accordion.css";

// Simple component that takes in a header and children, with the ability to show or hide children.
const Accordion = ({ header, children }) => {
  const [hidden, setHidden] = useState(true);

  return (
    <div className="accordion">
      <div
        className="accordion-header"
        onClick={() => setHidden(!hidden)}
        role="presentation"
      >
        {header}
        <span className="accordion-arrow">
          {hidden ? (
            <i className="material-icons">expand_more</i>
          ) : (
            <i className="material-icons">expand_less</i>
          )}
        </span>
      </div>
      <div className="accordion-children" hidden={hidden}>
        {children}
      </div>
    </div>
  );
};

Accordion.propTypes = {
  header: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default Accordion;
