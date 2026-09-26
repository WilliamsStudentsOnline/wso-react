import React from "react";
import Select from "./Select";
import Button from "./Button";
import "./Pagination.css";

export interface PaginationProps {
  clickHandler: (direction: number) => void;
  total: number;
  page: number;
  perPage: number;
  showPages?: boolean;
  selectionHandler?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  clickHandler,
  total = 0,
  page,
  perPage,
  showPages = true,
  selectionHandler = undefined,
}) => {
  if (total <= perPage) return null;

  const pages = () => {
    if (showPages && selectionHandler) {
      return (
        <div className="wso-pagination__pages">
          Page&nbsp;&nbsp;&nbsp;
          <Select
            onChange={(event) => {
              selectionHandler(parseInt(event.target.value, 10) - 1);
            }}
            options={Array.from(
              Array(Math.ceil(total / perPage)),
              (_e, i) => i + 1
            )}
            value={page + 1}
            valueList={Array.from(
              Array(Math.ceil(total / perPage)),
              (_e, i) => i + 1
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
    <div className="wso-pagination">
      <Button
        variant="secondary"
        onClick={() => clickHandler(-1)}
        disabled={page === 0}
        className="wso-pagination__btn"
        aria-label="Previous page"
      >
        <i className="material-icons">keyboard_arrow_left</i>
      </Button>
      {pages()}
      <Button
        variant="secondary"
        onClick={() => clickHandler(1)}
        disabled={total - (page + 1) * perPage <= 0}
        className="wso-pagination__btn"
        aria-label="Next page"
      >
        <i className="material-icons">keyboard_arrow_right</i>
      </Button>
    </div>
  );
};

export default Pagination;
