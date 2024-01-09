// React imports
import React from "react";
import PropTypes from "prop-types";

// Component Imports
import Select from "./Select";

const PaginationButtons = ({
  clickHandler,
  total,
  page,
  perPage,
  showPages,
  selectionHandler,
}) => {
  if (total <= perPage) return null;

  const buttonStyle = {
    backgroundColor: "#fff",
    color: "#4b2771",
    minWidth: 0,
    lineHeight: "normal",
  };

  const pages = () => {
    if (showPages && selectionHandler) {
      return (
        <div style={{ display: "inline" }}>
          Page&nbsp;&nbsp;&nbsp;
          <Select
            onChange={(event) => {
              selectionHandler(parseInt(event.target.value - 1, 10));
            }}
            options={Array.from(
              Array(Math.ceil(total / perPage)),
              (e, i) => i + 1
            )}
            value={page + 1}
            valueList={Array.from(
              Array(Math.ceil(total / perPage)),
              (e, i) => i + 1
            )}
            style={{ display: "inline" }}
          />
          of&nbsp;
          {Math.ceil(total / perPage)}
        </div>
      );
    }

    return `Page ${page + 1} of ${Math.ceil(total / perPage)}`;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button
        type="button"
        onClick={() => clickHandler(-1)}
        disabled={page === 0}
        style={buttonStyle}
      >
        <i className="material-icons">keyboard_arrow_left</i>
      </button>
      {pages()}
      <button
        type="button"
        onClick={() => clickHandler(1)}
        disabled={total - (page + 1) * perPage <= 0}
        style={buttonStyle}
      >
        <i className="material-icons">keyboard_arrow_right</i>
      </button>
    </div>
  );
};

PaginationButtons.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  total: PropTypes.number,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  showPages: PropTypes.bool,
  selectionHandler: PropTypes.func,
};

PaginationButtons.defaultProps = {
  total: 0,
  showPages: true,
  selectionHandler: null,
};

export default PaginationButtons;
