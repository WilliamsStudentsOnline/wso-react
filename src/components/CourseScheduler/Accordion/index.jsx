// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  accordionHeader,
  accordionArrow,
  accordionChildren,
} from "./Accordion.module.scss";

// Simple component that takes in a header and children, with the ability to show or hide children.
const Accordion = ({ children, header, startsHidden }) => {
  const [hidden, setHidden] = useState(startsHidden);

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
  children: PropTypes.element.isRequired,
  header: PropTypes.string.isRequired,
  startsHidden: PropTypes.bool,
};

Accordion.defaultProps = {
  startsHidden: true,
};

export default Accordion;
