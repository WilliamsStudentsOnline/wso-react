import React, { useState, ReactNode } from "react";

type AdminTaskSectionProps = {
  title: string;
  count: number;
  children: ReactNode;
  startsOpen?: boolean;
};

const AdminTaskSection = ({
  title,
  count,
  children,
  startsOpen = true,
}: AdminTaskSectionProps) => {
  const [open, setOpen] = useState(startsOpen);

  return (
    <div className="admin-task-section">
      <button
        type="button"
        className="admin-task-section__header"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <h3 className="admin-task-section__title">{title}</h3>
        <span
          className="admin-task-section__badge"
          aria-label={`${count} open`}
        >
          {count}
        </span>
        <span className="admin-task-section__arrow material-icons" aria-hidden>
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>
      {open && <div className="admin-task-section__body">{children}</div>}
    </div>
  );
};

export default AdminTaskSection;
