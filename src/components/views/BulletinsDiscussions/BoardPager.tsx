import React from "react";

type BoardPagerProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

const MAX_SLOTS = 7;

const pageSlots = (page: number, pageCount: number): (number | null)[] => {
  if (pageCount <= MAX_SLOTS) return [...Array(pageCount).keys()];
  const last = pageCount - 1;
  if (page <= 3) return [0, 1, 2, 3, 4, null, last];
  if (page >= last - 3)
    return [0, null, last - 4, last - 3, last - 2, last - 1, last];
  return [0, null, page - 1, page, page + 1, null, last];
};

const BoardPager = ({ page, pageCount, onChange }: BoardPagerProps) => {
  if (pageCount <= 1) return null;

  return (
    <nav className="board-pager" aria-label="Pages">
      <button
        type="button"
        className="board-pager__btn"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </button>
      <span className="board-pager__pages">
        {pageSlots(page, pageCount).map((slot, i) =>
          slot === null ? (
            // eslint-disable-next-line react/no-array-index-key
            <span className="board-pager__gap" key={`gap-${i}`}>
              …
            </span>
          ) : (
            <button
              key={slot}
              type="button"
              className={`board-pager__btn board-pager__num${
                slot === page ? " is-active" : ""
              }`}
              aria-label={`Page ${slot + 1}`}
              aria-current={slot === page ? "page" : undefined}
              onClick={() => onChange(slot)}
            >
              {slot + 1}
            </button>
          )
        )}
      </span>
      <button
        type="button"
        className="board-pager__btn"
        disabled={page === pageCount - 1}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
};

export default BoardPager;
