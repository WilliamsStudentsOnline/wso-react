import React, { ReactNode } from "react";

export type ContentPaneVariant =
  | "results"
  | "main-table"
  | "list-creation"
  | "article"
  | "section";

export type ContentPaneProps = {
  variant?: ContentPaneVariant;
  children: ReactNode;
  className?: string;
  as?: "article" | "div" | "section";
};

const variantClass: Record<ContentPaneVariant, string> = {
  results: "facebook-results",
  "main-table": "main-table",
  "list-creation": "list-creation",
  article: "article",
  section: "",
};

const ContentPane = ({
  variant = "results",
  children,
  className = "",
  as,
}: ContentPaneProps) => {
  const Tag =
    as ??
    (variant === "article"
      ? "div"
      : variant === "section"
      ? "section"
      : "article");
  const classes = [variantClass[variant], className].filter(Boolean).join(" ");

  return <Tag className={classes}>{children}</Tag>;
};

export default ContentPane;
