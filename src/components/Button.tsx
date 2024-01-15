// React imports
import React from "react";
import { ButtonProps } from "../lib/types";

const Button = ({ children, ...other }: ButtonProps) => {
  return (
    <button type="button" {...other}>
      {children}
    </button>
  );
};

export default Button;
