import React from "react";
import "./Button.css";

/* eslint-disable react/prop-types -- TypeScript props */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "inverted"
  | "toggle"
  | "toggleActive"
  | "submit"
  | "link";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children?: React.ReactNode;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "wso-btn wso-btn--primary",
  secondary: "wso-btn wso-btn--secondary inline-button",
  inverted: "wso-btn wso-btn--inverted inline-button-inverted",
  toggle: "wso-btn wso-btn--toggle button-default",
  toggleActive: "wso-btn wso-btn--toggle-active button-toggled",
  submit: "wso-btn wso-btn--submit submit",
  link: "wso-btn wso-btn--link",
};

const Button = ({
  children,
  variant = "secondary",
  className = "",
  type = "button",
  ...other
}: ButtonProps) => {
  const classes = [variantClass[variant], className].filter(Boolean).join(" ");
  return (
    // eslint-disable-next-line react/button-has-type, react/prop-types
    <button type={type} className={classes} {...other}>
      {children}
    </button>
  );
};

export default Button;
