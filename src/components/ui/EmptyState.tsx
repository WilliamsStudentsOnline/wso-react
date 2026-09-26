import React, { ReactNode } from "react";

export type EmptyStateProps = {
  children: ReactNode;
  className?: string;
  variant?: "no-matches" | "no-posts" | "plain";
};

const EmptyState = ({
  children,
  className = "",
  variant = "no-matches",
}: EmptyStateProps) => {
  const variantClass =
    variant === "no-matches"
      ? "no-matches-found"
      : variant === "no-posts"
      ? "no-posts"
      : "";
  return (
    <h1 className={[variantClass, className].filter(Boolean).join(" ")}>
      {children}
    </h1>
  );
};

export default EmptyState;
