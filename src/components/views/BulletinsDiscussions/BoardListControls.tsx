import React from "react";
import { PostType, PostTypeName } from "../../../lib/types";
import "./BoardFeed.css";

const ALL_TYPES = Object.values(PostType);

export type BoardListControlsProps = {
  selectedTypes: PostType[];
  onTypesChange: (types: PostType[]) => void;
};

const BoardListControls = ({
  selectedTypes,
  onTypesChange,
}: BoardListControlsProps) => {
  const allSelected = selectedTypes.length === 0;

  const toggleType = (type: PostType) => {
    if (allSelected) {
      onTypesChange([type]);
      return;
    }
    if (selectedTypes.includes(type)) {
      const next = selectedTypes.filter((t) => t !== type);
      onTypesChange(next);
      return;
    }
    const next = [...selectedTypes, type];
    if (next.length === ALL_TYPES.length) {
      onTypesChange([]);
      return;
    }
    onTypesChange(next);
  };

  return (
    <div className="board-type-chips" role="group" aria-label="Filter by type">
      <button
        type="button"
        className={`board-chip${allSelected ? " is-active" : ""}`}
        onClick={() => onTypesChange([])}
      >
        All
      </button>
      {ALL_TYPES.map((type) => {
        const active = !allSelected && selectedTypes.includes(type);
        return (
          <button
            key={type}
            type="button"
            className={`board-chip${active ? " is-active" : ""}`}
            aria-pressed={active}
            onClick={() => toggleType(type)}
          >
            {PostTypeName.get(type)}
          </button>
        );
      })}
    </div>
  );
};

export default BoardListControls;
