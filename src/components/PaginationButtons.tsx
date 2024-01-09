// React imports
import React from "react";

// Component Imports
import Select from "./Select";

export interface PaginationButtonsProps {
  clickHandler: (direction: number) => void; // direction: -1 for previous, 1 for next
  total: number;
  page: number; // 0-indexed page number (i.e. 0 is the first page)
  perPage: number;
  showPages?: boolean;
  selectionHandler?: (page: number) => void;
}

const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  clickHandler,
  total = 0,
  page,
  perPage,
  showPages = true,
  selectionHandler = undefined,
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
              // subtract 1 because the page number is 0-indexed, whereas value is 1-indexed
              selectionHandler(parseInt(event.target.value, 10) - 1);
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

export default PaginationButtons;
