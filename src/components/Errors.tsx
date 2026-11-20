// React imports
import React from "react";

export interface ErrorsProps {
  errors?: string[];
}

const Errors = ({ errors = [] }: ErrorsProps) => {
  return (
    <div id="errors">
      {errors.length > 0 &&
        errors.map((msg) => {
          return <p key={msg}>{`* ${msg}`}</p>;
        })}
    </div>
  );
};

export default Errors;
