// React imports
import React from "react";
import { ButtonProps } from "../lib/types";
import { NavLink } from "react-router-dom";
import "./stylesheets/StylizedLink.css";

export const Button = ({ children, ...other }: ButtonProps) => {
  return (
    <button type="button" {...other}>
      {children}
    </button>
  );
};

export const StylizedLink = ({
  to,
  title,
  end,
  children,
}: {
  to: string;
  title?: string;
  end?: boolean;
  children?: React.ReactNode;
}) => {
  const applyActiveLinkStyling = ({
    isActive,
  }: {
    isActive: boolean;
  }): string => (isActive ? "active-stylized-link" : "");

  return (
    <NavLink
      to={to}
      className={applyActiveLinkStyling}
      title={title}
      end={end ?? false}
    >
      {children}
    </NavLink>
  );
};
