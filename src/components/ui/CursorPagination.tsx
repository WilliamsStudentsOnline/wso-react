import React from "react";
import Button from "./Button";
import "./Pagination.css";

export type CursorPaginationProps = {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

/** Prev/next only — for cursor feeds where total page count is unknown. */
const CursorPagination = ({
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: CursorPaginationProps) => {
  if (!hasPrev && !hasNext) return null;

  return (
    <div className="wso-pagination">
      <Button
        variant="secondary"
        onClick={onPrev}
        disabled={!hasPrev}
        className="wso-pagination__btn"
        aria-label="Previous page"
      >
        <i className="material-icons">keyboard_arrow_left</i>
      </Button>
      <Button
        variant="secondary"
        onClick={onNext}
        disabled={!hasNext}
        className="wso-pagination__btn"
        aria-label="Next page"
      >
        <i className="material-icons">keyboard_arrow_right</i>
      </Button>
    </div>
  );
};

export default CursorPagination;
