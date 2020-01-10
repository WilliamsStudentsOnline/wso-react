// React imports
import React from "react";
import PropTypes from "prop-types";

const PaginationButtons = ({ clickHandler, total, page, perPage }) => {
  if (total <= perPage) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => clickHandler(-1)}
        disabled={page === 0}
      >
        Previous
      </button>
      <button
        type="button"
        onClick={() => clickHandler(1)}
        disabled={total - (page + 1) * perPage <= 0}
      >
        Next
      </button>
    </div>
  );
};

PaginationButtons.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  total: PropTypes.number,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
};

PaginationButtons.defaultProps = {
  total: 0,
};

export default PaginationButtons;
