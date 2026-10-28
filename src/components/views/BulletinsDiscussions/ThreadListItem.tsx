import React, { ReactNode } from "react";
import { Button, CommentCard, Line } from "../../ui";
import "./BoardFeed.css";

export type ThreadListItemProps = {
  title?: ReactNode;
  chip?: ReactNode;
  meta?: ReactNode;
  detail?: ReactNode;
  excerpt?: ReactNode;
  onDelete?: () => void;
  showDelete?: boolean;
  skeleton?: boolean;
};

const ThreadListItem = ({
  title,
  chip,
  meta,
  detail,
  excerpt: excerptText,
  onDelete,
  showDelete = false,
  skeleton = false,
}: ThreadListItemProps) => {
  if (skeleton) {
    return (
      <CommentCard
        className="thread-list-item"
        header={
          <h5>
            <Line width="35%" />
          </h5>
        }
        body={
          <>
            <div className="small-font">
              <Line width="30%" />
            </div>
            <div className="small-font">
              <Line width="40%" />
            </div>
          </>
        }
      />
    );
  }

  return (
    <CommentCard
      className="thread-list-item"
      header={
        <h5 className="board-thread-title">
          {chip ? (
            <span className="board-chip board-chip-static is-active">
              {chip}
            </span>
          ) : null}
          <b>{title}</b>
        </h5>
      }
      body={
        <>
          {meta ? <div className="small-font">{meta}</div> : null}
          {detail ? <div className="small-font">{detail}</div> : null}
          {excerptText ? (
            <div className="small-font board-thread-excerpt">{excerptText}</div>
          ) : null}
        </>
      }
      cornerActions={
        showDelete && onDelete ? (
          <Button type="button" variant="secondary" onClick={onDelete}>
            Delete
          </Button>
        ) : null
      }
    />
  );
};

export default ThreadListItem;
