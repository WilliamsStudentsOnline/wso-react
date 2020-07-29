// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  accordionHeader,
  accordionArrow,
  accordionChildren,
} from "./Accordion.module.scss";

// Simple component that takes in a header and children, with the ability to show or hide children.
const Accordion = ({ header, children }) => {
  const [hidden, setHidden] = useState(true);

  return (
    <div>
      <div
        className={accordionHeader}
        onClick={() => setHidden(!hidden)}
        role="presentation"
      >
        {header}
        <span className={accordionArrow}>
          {hidden ? (
            <i className="material-icons">expand_more</i>
          ) : (
            <i className="material-icons">expand_less</i>
          )}
        </span>
      </div>
      <div className={accordionChildren} hidden={hidden}>
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
