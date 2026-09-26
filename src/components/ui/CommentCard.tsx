import React, { ReactNode } from "react";

export type CommentCardProps = {
  children?: ReactNode;
  className?: string;
  media?: ReactNode;
  header?: ReactNode;
  body?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
};

const CommentCard = ({
  children,
  className = "",
  media,
  header,
  body,
  meta,
  actions,
}: CommentCardProps) => {
  const hasSlots =
    header !== undefined || body !== undefined || meta !== undefined;

  if (!hasSlots) {
    return (
      <div className={["comment", className].filter(Boolean).join(" ")}>
        {media}
        {children}
      </div>
    );
  }

  return (
    <div className={["comment", className].filter(Boolean).join(" ")}>
      {media}
      <div className="comment-content">
        {header}
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
