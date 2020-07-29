// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../stylesheets/Accordion.css";

// Simple component that takes in a header and children, with the ability to show or hide children.
const Accordion = ({ children, header, startsHidden }) => {
  const [hidden, setHidden] = useState(startsHidden);

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
  children: PropTypes.element.isRequired,
  header: PropTypes.string.isRequired,
  startsHidden: PropTypes.bool,
};

Accordion.defaultProps = {
  startsHidden: true,
};

export default Accordion;
