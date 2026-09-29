import React, { ReactNode } from "react";
import { Button, CommentCard, Line } from "../../ui";

export type ThreadListItemProps = {
  title?: ReactNode;
  meta?: ReactNode;
  detail?: ReactNode;
  onDelete?: () => void;
  showDelete?: boolean;
  skeleton?: boolean;
};

const ThreadListItem = ({
  title,
  meta,
  detail,
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
        <h5>
          <b>{title}</b>
        </h5>
      }
      body={
        <>
          {meta ? <div className="small-font">{meta}</div> : null}
          {detail ? <div className="small-font">{detail}</div> : null}
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
