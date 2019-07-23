// React imports
import React, {useState} from 'react';
import PropTypes from 'prop-types';

// Component imports
import './stylesheets/Accordion.css';

const Accordion = ({header, children}) => {
  const [hidden, setHidden] = useState(true);

  return (
    <div className="accordion">
      <div className="accordion-header" onClick={() => setHidden(!hidden)} role="presentation">
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
  children: PropTypes.element.isRequired
};

export default Accordion;
