import React, { ReactNode } from "react";

export type CommentCardProps = {
  children?: ReactNode;
  className?: string;
  media?: ReactNode;
  header?: ReactNode;
  body?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  cornerActions?: ReactNode;
};

const CommentCard = ({
  children,
  className = "",
  media,
  header,
  body,
  meta,
  actions,
  cornerActions,
}: CommentCardProps) => {
  const hasSlots =
    header !== undefined || body !== undefined || meta !== undefined;

  const classes = [
    "comment",
    cornerActions ? "has-corner-actions" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const headerRow =
    header !== undefined || cornerActions ? (
      <div className="comment-header-row">
        <div className="comment-header">{header}</div>
        {cornerActions ? (
          <div className="comment-corner-actions">{cornerActions}</div>
        ) : null}
      </div>
    ) : null;

  if (!hasSlots) {
    return (
      <div className={classes}>
        {headerRow}
        {media}
        {children}
      </div>
    );
  }

  return (
    <div className={classes}>
      {media}
      <div className="comment-content">
        {headerRow}
        {body}
        {(meta || actions) && (
          <div className="comment-detail">
            {meta}
            {actions}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default CommentCard;
